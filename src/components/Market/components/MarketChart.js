import React from 'react'

import {timeFormat} from 'd3-time-format'

import {ChartCanvas, Chart} from 'react-stockcharts'
import {
    CandlestickSeries,
    BarSeries,
    AreaSeries,
    LineSeries,
    BollingerSeries,
    StochasticSeries
} from 'react-stockcharts/lib/series'
import {XAxis, YAxis} from 'react-stockcharts/lib/axes'
import {HoverTooltip} from 'react-stockcharts/lib/tooltip'
import {fitWidth} from 'react-stockcharts/lib/helper'
import {first, last} from 'react-stockcharts/lib/utils'
import {CrossHairCursor, CurrentCoordinate} from 'react-stockcharts/lib/coordinates'
import {sma, bollingerBand, stochasticOscillator} from 'react-stockcharts/lib/indicator'
import {discontinuousTimeScaleProvider} from 'react-stockcharts/lib/scale'
import {StochasticTooltip} from 'react-stockcharts/lib/tooltip'

import {parseCurrency} from '../parser'

const bbStroke = {
    top: 'deeppink',
    middle: 'transparent',
    bottom: 'deeppink'
}

const bbFill = 'transparent'

const stoAppearance = {
    stroke: Object.assign({}, StochasticSeries.defaultProps.stroke)
}

const candleAppearance = {
    wickStroke: function fill(d) {
        return d.close > d.open ? 'coral' : 'dodgerblue'
    },
    candleStrokeWidth: 0,
    fill: function fill(d) {
        return d.close > d.open ? 'coral' : 'dodgerblue'
    },
    stroke: function fill(d) {
        return d.close > d.open ? 'coral' : 'dodgerblue'
    }
}

class MarketChart extends React.PureComponent {
    render() {
        let {priceData, width, ratio, type, region, indicators} = this.props

        if (priceData.size === 0) {
            return <div className="no-data">No Data</div>
        }

        let previous = 0
        let initialData = priceData
            .map(d => {
                let date = d.get(0)
                    ? new Date(`${d.get(0).split('~')[0]} ${region === 'na' ? 'CST' : 'GMT'}`)
                    : new Date()
                let dataPoint = {
                    date: date,
                    volume: d.get(2),
                    open: d.get(4),
                    close: d.get(5),
                    low: d.get(6),
                    high: d.get(7)
                }

                if (d.get(2) === 0 && previous) {
                    return {
                        date: date,
                        volume: 0,
                        open: previous,
                        close: previous,
                        low: previous,
                        high: previous
                    }
                }
                previous = dataPoint.close
                return dataPoint
            })
            .toJS()

        let margin = {left: 40, right: 50, top: 20, bottom: 30}
        let gridWidth = width - margin.left - margin.right
        let yGrid = {
            innerTickSize: -1 * gridWidth,
            tickStrokeDasharray: 'Solid',
            tickStrokeOpacity: 0.2,
            tickStrokeWidth: 1
        }

        const sma10 = sma()
            .merge((d, c) => {
                d.sma20 = c
            })
            .accessor(d => d.sma20)
            .stroke('lightgreen')

        const bb = bollingerBand()
            .merge((d, c) => {
                d.bb = c
            })
            .accessor(d => d.bb)

        const fullSTO = stochasticOscillator()
            .options({windowSize: 10, kWindowSize: 3, dWindowSize: 4})
            .merge((d, c) => {
                d.fullSTO = c
            })
            .accessor(d => d.fullSTO)

        const calculatedData = sma10(bb(fullSTO(initialData)))
        const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(d => d.date)
        const {data, xScale, xAccessor, displayXAccessor} = xScaleProvider(calculatedData)
        const xExtents = [xAccessor(last(data)), xAccessor(first(data))]

        let graph =
            type === 'candlestick' ? (
                <CandlestickSeries {...candleAppearance} />
            ) : (
                <AreaSeries yAccessor={d => d.close} />
            )

        let extras = []

        if (indicators.get('sma')) {
            extras.push(
                <LineSeries yAccessor={sma10.accessor()} stroke={sma10.stroke()} />,
                <CurrentCoordinate yAccessor={sma10.accessor()} fill={sma10.stroke()} />
            )
        }

        if (indicators.get('bb')) {
            extras.push(<BollingerSeries yAccessor={d => d.bb} stroke={bbStroke} fill={bbFill} />)
        }

        return (
            <ChartCanvas
                height={indicators.get('sto') ? 800 : 600}
                ratio={ratio}
                width={width}
                margin={margin}
                type="hybrid"
                seriesName="BNS"
                data={data}
                xAccessor={xAccessor}
                displayXAccessor={displayXAccessor}
                xScale={xScale}
                xExtents={xExtents}
                clamp={true}>
                <Chart id={1} height={400} yExtents={d => [d.high + d.high * 0.05, 0]}>
                    <XAxis
                        axisAt="bottom"
                        orient="bottom"
                        showTicks={false}
                        stroke="rgba(255,255,255,0.3)"
                        zoomEnabled={false}
                    />
                    <YAxis
                        axisAt="right"
                        orient="right"
                        tickStroke="#aaaaaa"
                        stroke="transparent"
                        zoomEnabled={false}
                        tickPadding={5}
                        ticks={5}
                        tickFormat={p =>
                            parseCurrency(p)
                                .map((a, i) => (i === 0 ? a : pad(a)))
                                .join('.')}
                        {...yGrid}
                    />
                    {graph}
                    {extras}
                    <HoverTooltip
                        tooltipContent={tooltipContent(indicators)}
                        fontSize={12}
                        fill="rgba(0,0,0,0.8)"
                        bgFill="transparent"
                        stroke="transparent"
                        fontFill="#aaaaaa"
                    />
                </Chart>
                <Chart
                    id={2}
                    origin={(w, h) => [0, indicators.get('sto') ? h - 350 : h - 150]}
                    height={150}
                    yExtents={d => [d.volume, 0]}>
                    <XAxis
                        axisAt="bottom"
                        orient="bottom"
                        tickStroke="#aaaaaa"
                        stroke="#aaaaaa"
                        zoomEnabled={false}
                    />
                    <YAxis
                        zoomEnabled={false}
                        axisAt="left"
                        orient="left"
                        ticks={5}
                        tickStroke="#aaaaaa"
                        stroke="transparent"
                        {...yGrid}
                    />

                    <BarSeries yAccessor={d => d.volume} />
                </Chart>
                {indicators.get('sto') ? (
                    <Chart
                        id={5}
                        yExtents={[0, 100]}
                        height={150}
                        origin={(w, h) => [0, h - 150]}
                        padding={{top: 10, bottom: 10}}>
                        <XAxis
                            axisAt="bottom"
                            orient="bottom"
                            tickStroke="#aaaaaa"
                            stroke="#aaaaaa"
                        />
                        <YAxis
                            axisAt="right"
                            orient="right"
                            tickValues={[20, 50, 80]}
                            tickStroke="#aaaaaa"
                            stroke="transparent"
                        />

                        <StochasticSeries yAccessor={d => d.fullSTO} {...stoAppearance} />

                        <StochasticTooltip
                            origin={[-30, 10]}
                            yAccessor={d => d.fullSTO}
                            options={fullSTO.options()}
                            appearance={stoAppearance}
                            label="STO"
                        />
                    </Chart>
                ) : (
                    []
                )}
                <CrossHairCursor stroke="#cccccc" opacity={0.5} strokeDasharray="Solid" />
            </ChartCanvas>
        )
    }
}

export default fitWidth(MarketChart)

const dateFormat = timeFormat('%Y-%m-%d %H:%M')

function numberFormat(number) {
    return parseCurrency(number)
        .map((a, i) => (i === 0 ? a : Math.round(pad(a))))
        .join('.')
}

function tooltipContent(indicators) {
    return ({currentItem, xAccessor}) => {
        let labels = [
            {label: 'Open', value: currentItem.open && numberFormat(currentItem.open)},
            {label: 'High', value: currentItem.high && numberFormat(currentItem.high)},
            {label: 'Low', value: currentItem.low && numberFormat(currentItem.low)},
            {label: 'Close', value: currentItem.close && numberFormat(currentItem.close)},
            {label: 'Volume', value: currentItem.volume && currentItem.volume}
        ]

        if (indicators.get('sma')) {
            labels.push({label: 'SMA', value: currentItem.sma20 && numberFormat(currentItem.sma20)})
        }
        return {
            x: dateFormat(xAccessor(currentItem)),
            y: labels
        }
    }
}

function pad(d) {
    return d < 10 ? '0' + d.toString() : d.toString()
}
