var isNode = typeof module !== 'undefined' && module.exports, 
    React = isNode ? require('react') : window.React, 
    ReactDOM = isNode ? require('react') : window.ReactDOM;
    
var cancelScrollEvent = function (e) {
    e.stopImmediatePropagation();
    e.preventDefault();
    e.returnValue = false;
};

var addScrollEventListener = function (elem, handler) {
    elem.addEventListener('wheel', handler, false);
};

var removeScrollEventListener = function (elem, handler) {
    elem.removeEventListener('wheel', handler, false);
};

var ScrollLockMixin = {
    scrollLock: function (elem) {
        elem = elem || ReactDOM.findDOMNode(this);
        this.scrollElem = elem;
        addScrollEventListener(elem, this.onScrollHandler);
    },

    scrollRelease: function (elem) {
        elem = elem || this.scrollElem;
        removeScrollEventListener(elem, this.onScrollHandler);
    },

    onScrollHandler: function (e) {
        var elem = this.scrollElem;
        var scrollTop = elem.scrollTop;
        var scrollHeight = elem.scrollHeight;
        var height = elem.clientHeight;
        var wheelDelta = e.deltaY;
        var isDeltaPositive = wheelDelta > 0;

        if (isDeltaPositive && wheelDelta > scrollHeight - height - scrollTop) {
          elem.scrollTop = scrollHeight;
          return cancelScrollEvent(e);
        }
        else if (!isDeltaPositive && -wheelDelta > scrollTop) {
          elem.scrollTop = 0;
          return cancelScrollEvent(e);
        }
    }
};

function searchById(arr, id) {
    var index = arr.map(function(x) {return x._id; }).indexOf(id);
    return arr[index];
}

function convertTooltipStats(tooltipData) {
    var order = ["Critical", "Accuracy", "Piercing", "Health", "Defense", "Block", "Evasion", "Critical Defense"];
    for (var p in tooltipData.pieces) {
        var statData = tooltipData.pieces[p].stats,
            arr = [],
            mV = statData.mValue.sort(function(a, b) {return a - b}).reverse(),
            s1V = null,
            s2T = statData.s2Type.sort(function(a, b) {
                return order.indexOf(a) - order.indexOf(b);
            }),
            s2V = statData.s2Value.sort(function(a, b) {return a - b}).reverse();
        
        if (statData.s1Type) {
            s1V = statData.s1Value.sort(function(a, b) {return a - b}).reverse();
        }

        for (var m in mV) {
            for (var s2Type in statData.s2Type) {
                for (var s2Value in s2V) {
                    var statObj = {
                        "mValue" : mV[m],
                        "s2Type" : s2T[s2Type],
                        "s2Value" : s2V[s2Value]
                    };
                    if (statData.s1Type) {
                        statObj.s1Type = statData.s1Type;
                        statObj.s1Value = s1V[m];
                    }

                    arr.push(statObj);
                }
            }
        }
        
        tooltipData.pieces[p].stats = arr;
    }
    
    return tooltipData;
}

var Mixer = React.createClass({
    getInitialState: function () {
        var equip = [
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null
        ];
        
        var fuse = [
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null
        ];
    
        return {
            shareCode: "",
            listData: null,
            tooltipCache: [],
            equipData : equip,
            fuseData: fuse,
            selectedSet: null,
            selectedListPiece: null,
            selectedEquipPiece: null
        };
    },
    componentDidMount: function() {
        var t = this;
        var types = ["Critical", "Accuracy", "Piercing", "Health", "Defense", "Block", "Evasion", "Critical Defense"];
        
        $.post('/mixer/data', {}, function(data, status){
            t.state.tooltipCache.push(convertTooltipStats(data[1]));
            
            if (buildCode != "") {
                var unparsedArray = buildCode.split(" "),
                    downloadSet = [];
                
                for (var s in unparsedArray) {
                    var setId = unparsedArray[s].substring(0, 4);
                    
                    if (unparsedArray[s] != "-") {
                        if (!searchById(t.state.tooltipCache, setId) && downloadSet.indexOf(setId) < 0) {
                            downloadSet.push(setId);
                        }
                    }
                }
                
                $.post('/mixer/tooltipData', {id: JSON.stringify(downloadSet)}, function(data, status) {
                    var initial = null;
                    
                    for (var d in data) {
                        t.state.tooltipCache.push(convertTooltipStats(data[d]));
                    }
                    for (var p in unparsedArray) {
                        if (!initial) {
                            initial = parseInt(p) + 1;
                        }
                        if (unparsedArray[p] != "") {
                            var setId = unparsedArray[p].substring(0, 4),
                                selectedStat = unparsedArray[p].charCodeAt(4) - 97,
                                fuseType = types[unparsedArray[p].substring(5, 6)],
                                fuseValue = parseInt(unparsedArray[p].substring(6));

                            var tooltip = searchById(t.state.tooltipCache, setId);
                            var maxFuse = tooltip.pieces[p].maxFuse;

                            if (fuseValue < 0) {
                                fuseValue = 0;
                            }
                            else if (fuseValue > maxFuse) {
                                fuseValue = maxFuse;
                            }

                            t.state.equipData[p] = setId;
                            t.state.fuseData[p] = {
                                type : fuseType,
                                value : fuseValue
                            };

                            tooltip.pieces[p].selectedStat = selectedStat;
                        }
                    }
                    
                    t.setState({
                        selectedListPiece: null,
                        selectedEquipPiece: initial,
                        equipData: t.state.equipData,
                        fuseData: t.state.fuseData,
                        tooltipCache: t.state.tooltipCache
                    });
                });
            }
        
            t.setState({
                listData: data[0],
                selectedSet: data[0][0]._id,
                tooltipCache: t.state.tooltipCache,
                selectedListPiece: 1
            });
            
            t.generateCode();
        });
    },
    generateCode: function() {
        var code = "https://" + window.location.host + "/soulshield?c=";
        var types = ["Critical", "Accuracy", "Piercing", "Health", "Defense", "Block", "Evasion", "Critical Defense"];
        
        for (var p = 0; p < 8; p++) {
            if (p != 0){
                code += "+";
            }
            
            if (this.state.equipData[p]) {
                code += this.state.equipData[p];
                
                var tooltip = searchById(this.state.tooltipCache, this.state.equipData[p]);
                
                code += String.fromCharCode(97 + parseInt(tooltip.pieces[p].selectedStat));
                
                if (this.state.fuseData[p]) {
                    code += types.indexOf(this.state.fuseData[p].type);
                    code += this.state.fuseData[p].value;
                }
            }
            else {
                code += "+";
            }
        }
        
        this.setState({
            shareCode: code 
        });
    },
    selectSet: function(id) {
        var t = this;
        
        var tooltip = searchById(this.state.tooltipCache, id);
        
        var initial = 1;
        if (this.state.selectedEquipPiece) {
            initial = null;
        }
        
        if (tooltip && id != this.state.selectedSet) {
            t.setState({
                selectedSet: id,
                selectedListPiece: initial
            });
        }
        else if (id != this.state.selectedSet) {
            $.post('/mixer/tooltipData', {id: JSON.stringify([id])}, function(data, status) {
                t.state.tooltipCache.push(convertTooltipStats(data[0]));
                
                t.setState({
                    tooltipCache: t.state.tooltipCache,
                    selectedSet: id,
                    selectedListPiece: initial
                });
            });
        }
    },
    selectPiece: function(equip, pos, id) {
        if (equip || this.state.equipData[pos - 1] == id) {
            this.setState({
                selectedListPiece: null,
                selectedEquipPiece: pos
            });
        }
        else {
            this.setState({
                selectedListPiece: pos,
                selectedEquipPiece: null
            });
        }
        
        this.generateCode();
    },
    equipPiece: function(id, pos) {
        if (this.state.equipData[pos - 1] != id) {
            this.state.equipData[pos - 1] = id;
            this.state.fuseData[pos - 1] = {
                "type" : "Critical",
                "value" : 0
            };
            
            if (!searchById(this.state.tooltipCache, id).pieces[pos - 1].selectedStat) {
                searchById(this.state.tooltipCache, id).pieces[pos - 1].selectedStat = 0;
            }

            this.setState({
                tooltipCache: this.state.tooltipCache,
                equipData: this.state.equipData,
                fuseData: this.state.fuseData,
                selectedListPiece: null,
                selectedEquipPiece: pos
            });
        }
        
        this.generateCode();
    },
    unequipPiece: function(pos, e) {
        e.preventDefault();
        this.state.equipData[pos - 1] = null;
        this.state.fuseData[pos - 1] = null;
        
        this.setState({
            equipData: this.state.equipData,
            selectedEquipPiece: null
        });
        
        this.generateCode();
    },
    setStatGroup: function(id, pos, e) {
        searchById(this.state.tooltipCache, id).pieces[pos - 1].selectedStat = e.target.value;
        this.setState({
            tooltipCache: this.state.tooltipCache
        });
        
        this.generateCode();
    },
    setFuseType: function(pos, e) {
        var type = e.target.value,
            data = this.state.fuseData[pos - 1];
        if (type == "Health" && data.type != "Health") {
            data.value = data.value * 10;
        }
        else if (type != "Health" && data.type == "Health") {
        data.value = data.value / 10;
        }
        data.type = type;
        
        this.setState({
            fuseData: this.state.fuseData
        });
        
        this.generateCode();
    },
    setFuseValue: function(pos, max, e) {
        var value = e.target.value,
            data = this.state.fuseData[pos - 1];
    
        if (e.target.value == "") {
            data.value = "";
        }
        else if (value < 0) {
            data.value = 0;
        }
        else if (data.type == "Health" && value > max * 10) {
            data.value = max * 10;
        }
        else if (data.type == "Health" && value <= max * 10) {
            data.value = value;
        }
        else if (value > max) {
            data.value = max;
        }
        else {
            data.value = value;
        }
        
        this.setState({
            fuseData: this.state.fuseData
        });
        
        this.generateCode();
    },
    maxFuseValue: function(pos, max) {
        var data = this.state.fuseData[pos - 1];
        
        data.value = max;
        
        this.setState({
            fuseData: this.state.fuseData
        });
        
        this.generateCode();
    },
    fuseBlur: function(pos, e) {
        if (e.target.value == "") {
            this.state.fuseData[pos - 1].value = 0;
        }
        
        if (this.state.fuseData[pos - 1].type == "Health") {
            this.state.fuseData[pos - 1].value = Math.round(e.target.value / 10) * 10;
        }
        
        this.setState({
            fuseData: this.state.fuseData
        });
        
        this.generateCode();
    },
    highlight: function(event) {
        event.target.select();
    },
    render: function () {
        var setListData = null,
            setTooltipData = null,
            selectedPiece = null,
            setEffect = 0,
            tooltipDiv = null,
            equipped = false;
        if (this.state.selectedEquipPiece) {
            equipped = true;
            selectedPiece = this.state.selectedEquipPiece;
            setListData = searchById(this.state.listData, this.state.equipData[selectedPiece - 1]);
            setTooltipData = searchById(this.state.tooltipCache, this.state.equipData[selectedPiece - 1]);
            for (var i in this.state.equipData) {
                if (this.state.equipData[selectedPiece - 1] == this.state.equipData[i]) {
                    setEffect += 1;
                }
            }
        }
        else if (this.state.selectedListPiece && this.state.selectedSet) {
            selectedPiece = this.state.selectedListPiece;
            setListData = searchById(this.state.listData, this.state.selectedSet);
            setTooltipData = searchById(this.state.tooltipCache, this.state.selectedSet);
            setEffect = 8;
        }
        
        if (selectedPiece) {
            tooltipDiv =
                <SSTooltip 
                    setEffectNumber={setEffect}
                    setListData={setListData} 
                    setTooltipData={setTooltipData}
                    selectedPiece={selectedPiece}
                    equipped={equipped}
                    fullListData={this.state.listData}
                    equipData={this.state.equipData}
                    fuseData={this.state.fuseData}
                    
                    setFuseType={this.setFuseType}
                    setFuseValue={this.setFuseValue}
                    maxFuseValue={this.maxFuseValue}
                    fuseBlur={this.fuseBlur}
                    setStatGroup={this.setStatGroup}
                />;
        }
        
        return (
            <div>
                <nav className="navbar navbar-inverse navbar-static-top mixerNav">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <h1 className="subtitle">Soul Shield Mixer</h1>
                        </div>
                        <form className="navbar-form navbar-right">
                            <div className="form-group">
                                <label>Share</label>
                                <input className="form-control" type="text" value={this.state.shareCode} onClick={this.highlight} readOnly/>
                            </div>
                        </form>
                    </div>
                </nav>
                <SSList 
                    listData={this.state.listData} 
                    selectedSet={this.state.selectedSet}
                    selectedListPiece={this.state.selectedListPiece}
                    
                    selectSet={this.selectSet}
                    selectPiece={this.selectPiece}
                    equipPiece={this.equipPiece}
                />
                <div className="equipTooltipGroup col-lg-8">
                    <div className="soulshieldTooltip col-sm-6 col-sm-push-6">
                        {tooltipDiv}
                    </div>
                    <SSEquip
                        listData={this.state.listData} 
                        equipData={this.state.equipData}
                        fuseData={this.state.fuseData}
                        tooltipData={this.state.tooltipCache}
                        selectedEquipPiece={this.state.selectedEquipPiece}

                        unequipPiece={this.unequipPiece}
                        selectPiece={this.selectPiece}
                    />
                </div>
            </div>
        );
    }
});


var SSList = React.createClass({
    getInitialState: function () {
        return {
            filterInput: "",
            minLevel: 0,
            maxLevel: 50,
            filterAdvanced : true,
            filterSuperior : true,
            filterHeroic: true,
            filterLegendary: true,
            filterMode: false
        }
    },
    handleFilterInput: function(e) {
        this.setState({
            filterInput: e.target.value
        });
    },
    handleLevelInput: function(type, e) {
        var value = e.target.value;
        if (!isNaN(value) && value >= 0 && value <=  50) {
            if (type == "min") {
                this.setState({
                    minLevel: value
                });
            }
            else {
                this.setState({
                    maxLevel: value
                });
            }
        }
    },
    blurLv: function(type, e) {
        if (e.target.value == "") {
            if (type == "min") {
                this.setState({
                    minLevel: 0
                });
            }
            else {
                this.setState({
                    maxLevel: 50
                });
            }
        }
    },
    clearFilter: function(e) {
        this.setState({
            filterInput: ""
        });
    },
    checkAll: function(b) {
        if (b) {
            this.setState({
                filterAdvanced : true,
                filterSuperior : true,
                filterHeroic: true,
                filterLegendary: true
            });
        }
        else {
            this.setState({
                filterAdvanced : false,
                filterSuperior : false,
                filterHeroic: false,
                filterLegendary: false
            });
        }
    },
    gradeFilter: function(g) {
        switch (g) {
            case 3:
                this.setState({
                    filterAdvanced : !this.state.filterAdvanced
                });
                break;
            case 4:
                this.setState({
                    filterSuperior : !this.state.filterSuperior
                });
                break;
            case 5:
                this.setState({
                    filterHeroic : !this.state.filterHeroic
                });
                break;
            case 7:
                this.setState({
                    filterLegendary : !this.state.filterLegendary
                });
                break;
        }
    },
    render: function() {
        var listData = this.props.listData,
            listEntries = [];
        
        for (var l in listData) {  
            var entryData = listData[l],
                input = this.state.filterInput.toLowerCase().trim(),
                inputCheck = input == "" || entryData.name.toLowerCase().startsWith(input),
                levelCheck = this.state.minLevel <= entryData.level && this.state.maxLevel >= entryData.level,
                gradeCheck = (this.state.filterAdvanced && entryData.grade == 3) ||(this.state.filterSuperior && entryData.grade == 4) || (this.state.filterHeroic && entryData.grade == 5) || (this.state.filterLegendary && entryData.grade == 7);
                
            if (inputCheck && levelCheck && gradeCheck) {
                var selectedListPiece = null,
                    selected = false;
                if (listData[l]._id == this.props.selectedSet) {
                    selectedListPiece = this.props.selectedListPiece,
                    selected = true;
                }

                listEntries.push(
                    <SSListEntry 
                        entryData={entryData} 
                        selectedPiece={selectedListPiece}
                        selected={selected}

                        selectSet={this.props.selectSet}
                        selectPiece={this.props.selectPiece}
                        equipPiece={this.props.equipPiece}
                        
                        key={entryData._id}
                    />
                );
            }
        }
        
        var clear = null;
        if (this.state.filterInput != "") {
            clear = <span className="glyphicon glyphicon-remove" aria-hidden="true" onClick={this.clearFilter}></span>;
        }
        var allChecked = this.state.filterAdvanced && this.state.filterSuperior && this.state.filterHeroic && this.state.filterLegendary;
        return (
            <div>
                <div className="listFilter form-inline"> 
                    <form className="navbar-form">
                        <div className="form-group searchInput">
                            <input value={this.state.filterInput} onChange={this.handleFilterInput} type="text" className="form-control" placeholder="Search"></input>
                            {clear}
                        </div>
                        <div className="form-group levelInput">
                            <label>Level</label>
                            <input value={this.state.minLevel} onChange={this.handleLevelInput.bind(null, "min")} onBlur={this.blurLv.bind(null, "min")} type="number" className="form-control"></input>
                        </div>
                        <div className="form-group levelInput">
                            <label>~</label>
                            <input value={this.state.maxLevel} onChange={this.handleLevelInput.bind(null, "max")} onBlur={this.blurLv.bind(null, "max")} type="number" className="form-control"></input>
                        </div>
                        <div className="gradeFilters">
                            <div className="checkbox">
                                <label><input type="checkbox" checked={allChecked} onChange={this.checkAll.bind(null, !allChecked)} />All</label>
                            </div>
                            <div className="checkbox">
                                <label className="grade_3"><input type="checkbox" checked={this.state.filterAdvanced} onChange={this.gradeFilter.bind(null, 3)} />Refined</label>
                            </div>
                            <div className="checkbox">
                                <label className="grade_4"><input type="checkbox" checked={this.state.filterSuperior} onChange={this.gradeFilter.bind(null, 4)} />Superior</label>
                            </div>
                            <div className="checkbox">
                                <label className="grade_5"><input type="checkbox" checked={this.state.filterHeroic} onChange={this.gradeFilter.bind(null, 5)} />Heroic</label>
                            </div>
                            <div className="checkbox">
                                <label className="grade_7"><input type="checkbox" checked={this.state.filterLegendary} onChange={this.gradeFilter.bind(null, 7)} />Legendary</label>
                            </div>
                        </div>
                    </form>
                </div>
                <SSListContent components={listEntries}/>
            </div>
        );
    }
});

var SSListContent = React.createClass({
    mixins: [ScrollLockMixin],
    componentDidMount: function () {
        this.scrollLock();
    },
    render: function() {
        return (
            <div className="soulshieldList col-lg-4" onScroll={this.preventScroll}>
                {this.props.components}
                <li className="buffer"></li>
            </div>
        );
    }
});

var SSListEntry = React.createClass({
    handlePieceClick: function(p) {
        this.props.selectPiece(false, p, this.props.entryData._id);
        
        if (this.props.selectedPiece == p) {
            this.props.equipPiece(this.props.entryData._id, p);
        }
    },
    equip: function(p, e) {
        e.preventDefault();
        this.props.equipPiece(this.props.entryData._id, p);
    },
    render: function () {
        var data = this.props.entryData,
            piecesDiv = null;
        
        if (this.props.selected) {
            var pieces = [];
            
            for (var p = 1; p <= 8; p++) {                
                pieces.push(
                    <span className={"piece" + (this.props.selectedPiece == p ? " selected" : "")} key={this.props.entryData._id + p}><img width="50" src={"/img/soulshield/equipgem_" + data.iconBase + "_pos" + p + "_" + data.grade + "_1.png"} onClick={this.handlePieceClick.bind(null, p)} onContextMenu={this.equip.bind(null, p)} /></span>
                );
            }
            
            piecesDiv = <div className="pieces">{pieces}</div>
        }
        
        return (
            <div className="soulshieldListEntryWraper">
                <li className={"soulshieldListEntry" + (this.props.selected ? " selected" : "")} onClick={this.props.selectSet.bind(null, data._id)}>
                    <span className="thumb"><img src={"/img/soulshield/Item_Set_" + data._id + ".png"} /></span>
                    <span className={"name grade_" + data.grade}>{data.name}</span>
                </li>
                {piecesDiv}
            </div>
        );
    }
});

function occurances(arr) {
    var obj = {};
    
    for (var a in arr) {
        if (typeof obj[arr[a]] != "undefined") {
            obj[arr[a]] += 1;
        }
        else if (arr[a]) {
            obj[arr[a]] = 1;
        }
    }
    return obj;
}

function getEffectList(effect) {
    var effectList = [];
    for (var x in effect) {
        if (effect[x].skill) {
            var before = effect[x].before || "",
                after = effect[x].after || "";
            effectList.push(
                <p>{before + " "}<span className="skill">{effect[x].skill}</span>{" " + after}</p>
            );
        }
        else if (effect[x].text) {
            effectList.push(
                <p>{effect[x].text}</p>
            );
        }
        else if (effect[x].stats) {
            var stats = "Increases ";
            for (var s in effect[x].stats) {
                stats += effect[x].stats[s].type + " by " + effect[x].stats[s].value + ", ";
                if (effect[x].stats[s].type == "Critical Hit Damage") {
                    stats = stats.slice(0, -2) + "%, ";
                }
            }
            effectList.push(<p>{stats.slice(0, -2)}</p>);
        }
    }
    return effectList;
}


var SSEquip = React.createClass({
    render: function() {
        var pieces = [],
            count = 0,
            statTableHeader = null,
            statTable = [],
            setEffectsDiv = [];
        
        for (var p in this.props.equipData) {
            if (this.props.equipData[p]) {
                count += 1;
                
                var setListData = searchById(this.props.listData, this.props.equipData[p]),
                    plus1 = parseInt(p) + 1;
                
                pieces[p] = 
                    <span className={"equipPiece pos_" + plus1 + (plus1 == this.props.selectedEquipPiece ? " selected" : "")}>
                        <img src={"/img/soulshield/equipgem_" + setListData.iconBase + "_extra_pos" + plus1 + ".png"} />
                    </span>;
            }
        }
        
        if (count > 0) {
            var totals = {
                "Attack Power" : {
                    "base" : 0,
                    "fuse" : 0,
                    "set" : 0
                },
                "Piercing" : {
                    "base" : 0,
                    "fuse" : 0,
                    "set" : 0
                },
                "Accuracy" : {
                    "base" : 0,
                    "fuse" : 0,
                    "set" : 0
                },
                "Critical" : {
                    "base" : 0,
                    "fuse" : 0,
                    "set" : 0
                },
                "Critical Hit Chance" : {
                    "base" : 0,
                    "fuse" : 0,
                    "set" : 0
                },
                "Critical Hit Damage" : {
                    "base" : 0,
                    "fuse" : 0,
                    "set" : 0
                },
                "Health" : {
                    "base" : 0,
                    "fuse" : 0,
                    "set" : 0
                },
                "Defense" : {
                    "base" : 0,
                    "fuse" : 0,
                    "set" : 0
                },
                "Block" : {
                    "base" : 0,
                    "fuse" : 0,
                    "set" : 0
                },
                "Evasion" : {
                    "base" : 0,
                    "fuse" : 0,
                    "set" : 0
                },
                "Critical Defense" : {
                    "base" : 0,
                    "fuse" : 0,
                    "set" : 0
                },
                "Debuff Damage" : {
                    "base" : 0,
                    "fuse" : 0,
                    "set" : 0
                }
            }
            
            for (var j = 0; j < 8; j++) {
                if (this.props.equipData[j]) {
                    var tooltip = searchById(this.props.tooltipData, this.props.equipData[j]);
                    var selectedStat = 0;
                    if (tooltip.pieces[j].selectedStat) {
                        selectedStat = tooltip.pieces[j].selectedStat;
                    }
                    var stat = tooltip.pieces[j].stats[selectedStat];
                    
                    totals.Health.base += stat.mValue;
                    if (stat.s1Type) {
                        if (stat.s1Type == "Health") {
                            totals[stat.s1Type].base += stat.s1Value*10;
                        }
                        else {
                            totals[stat.s1Type].base += stat.s1Value;
                        }
                    }
                    if (stat.s2Type) {
                        if (stat.s2Type == "Health") {
                            totals[stat.s2Type].base += stat.s2Value*10;
                        }
                        else {
                            totals[stat.s2Type].base += stat.s2Value;
                        }
                    }
                    
                    var fuse = this.props.fuseData[j];
                    if (fuse) {
                        totals[fuse.type].fuse += parseInt(fuse.value);
                    }
                }
            }
            
            var setCount = occurances(this.props.equipData);
            
            for (var s in setCount) {
                var tooltip = searchById(this.props.tooltipData, s),
                    s3 = tooltip.setEffects[0].s3,
                    s5 = tooltip.setEffects[0].s5,
                    s8 = tooltip.setEffects[0].s8,
                    setEffects = [];
                
                if (setCount[s] >= 3 && s3) {
                    setEffects.push(
                        <div className="set">
                            <span className="effectLabel">3</span>
                            <div className="effectList">{getEffectList(s3)}</div>
                        </div>
                    );
                    for (var e1 in s3) {
                        if (s3[e1].stats) {
                            for (var a in s3[e1].stats) {
                                totals[s3[e1].stats[a].type].set += s3[e1].stats[a].value;
                            }
                        }
                    }
                }
                
                if (setCount[s] >= 5 && s5) {
                    setEffects.push(
                        <div className="set">
                            <span className="effectLabel">5</span>
                            <div className="effectList">{getEffectList(s5)}</div>
                        </div>
                    );
                
                    for (var e2 in s5) {
                        if (s5[e2].stats) {
                            for (var b in s5[e2].stats) {
                                totals[s5[e2].stats[b].type].set += s5[e2].stats[b].value;
                            }
                        }
                    }
                }
                
                if (setCount[s] >= 8 && s8) {
                    setEffects.push(
                        <div className="set">
                            <span className="effectLabel">8</span>
                            <div className="effectList">{getEffectList(s8)}</div>
                        </div>
                    );
                
                    for (var e3 in s8) {
                        if (s8[e3].stats) {
                            for (var c in s8[e3].stats) {
                                totals[s8[e3].stats[c].type].set += s8[e3].stats[c].value;
                            }
                        }
                    }
                }
                
                if (setEffects.length > 0){
                    setEffectsDiv.push(
                        <div>
                            <p className="effectName">{tooltip.setEffects[0].name}</p>
                            {setEffects}
                        </div>
                    );
                }
            }
            
            var statTypes = ["Attack Power", "Critical", "Critical Hit Chance", "Critical Hit Damage", "Accuracy", "Piercing", "Health", "Defense", "Block", "Evasion", "Critical Defense", "Debuff Damage"];
            
            for (var t in statTypes) {
                var typeObj = totals[statTypes[t]],
                    sum = typeObj.base + typeObj.fuse + typeObj.set;
                    
                if (sum > 0) {
                    var cp = statTypes[t] == "Critical Hit Chance" || statTypes[t] == "Critical Hit Damage" ? "%" : "";
                    statTable.push(
                        <tr>
                            <td>{statTypes[t]}</td>
                            <td className="sum">{sum + cp}</td>
                            <td>{"(" + typeObj.base + cp + " + "}<span className="adding">{typeObj.fuse + cp}</span>{" + "}<span className="adding">{typeObj.set + cp}</span>)</td>
                        </tr>
                    );
                }
            }
            
            statTableHeader = <h4>Total Stats <small>(Base + Fuse + Set)</small></h4>;
        }
        
        return(
            <div className="soulshieldEquip col-sm-6 col-sm-pull-6">
                <div className="mainEquip">
                    {pieces}
                    <img className="blankImg" src="/img/blank.gif" useMap="#map" width="300" height="300" />
                    <map name="map">
                        <area shape="poly" coords="150, 150, 15, 93, 95, 17" onClick={this.props.selectPiece.bind(null, true, 8)} onContextMenu={this.props.unequipPiece.bind(null, 8)} />
                        <area shape="poly" coords="150, 150, 15, 93, 15, 205" onClick={this.props.selectPiece.bind(null, true, 7)} onContextMenu={this.props.unequipPiece.bind(null, 7)} />
                        <area shape="poly" coords="150, 150, 15, 205, 92, 285" onClick={this.props.selectPiece.bind(null, true, 6)} onContextMenu={this.props.unequipPiece.bind(null, 6)} />
                        <area shape="poly" coords="150, 150, 92, 285, 205, 285" onClick={this.props.selectPiece.bind(null, true, 5)} onContextMenu={this.props.unequipPiece.bind(null, 5)} />
                        <area shape="poly" coords="150, 150, 205, 285, 285, 206" onClick={this.props.selectPiece.bind(null, true, 4)} onContextMenu={this.props.unequipPiece.bind(null, 4)} />
                        <area shape="poly" coords="150, 150, 285, 95, 285, 206" onClick={this.props.selectPiece.bind(null, true, 3)} onContextMenu={this.props.unequipPiece.bind(null, 3)} />
                        <area shape="poly" coords="150, 150, 205, 16, 285, 95" onClick={this.props.selectPiece.bind(null, true, 2)} onContextMenu={this.props.unequipPiece.bind(null, 2)} />
                        <area shape="poly" coords="150, 150, 205, 16, 96, 17" onClick={this.props.selectPiece.bind(null, true, 1)} onContextMenu={this.props.unequipPiece.bind(null, 1)} />
                    </map>
                </div>
                <div className="fullStats">
                    {statTableHeader}
                    <table className="statTable">
                        <tbody>
                            {statTable}
                        </tbody>
                    </table>
                    {setEffectsDiv}
                </div>
            </div>
        );   
    }
});


function pieceNumSymbol(n) {
    var symbol = "";
    switch (n) {
        case 1:
            symbol = "☵";
            break;
        case 2: 
            symbol = "☳";
            break;
        case 3:
            symbol = "☶";
            break;
        case 4:
            symbol = "☱";
            break;
        case 5:
            symbol = "☲";
            break;
        case 6:
            symbol = "☷";
            break;
        case 7:
            symbol = "☴";
            break;
        case 8:
            symbol = "☰";
            break;
    }
    return symbol;
}

var SSTooltip = React.createClass({
    render: function () {
        var main = null,
            sub1 = null,
            sub2 = null,
            extra = null,
            setEffectsDiv = null,
            acquireList = [],
            flavor = null,
            statSelector = null,
            fuseSetter = null,
            equipped = null;
            
        var set = this.props.setListData,
            pieceN = this.props.selectedPiece,
            tooltip = this.props.setTooltipData,
            pieceData = tooltip.pieces[pieceN - 1],
            fuseData = this.props.fuseData[pieceN - 1],
            statGroupIndex = 0;

        if (this.props.equipped) {
            equipped = <span className="equipped">Equipped</span>;
            
            var max = pieceData.maxFuse;
            if (pieceData.stats[statGroupIndex].modFuse) {
                max = pieceData.stats[statGroupIndex].modFuse;
            }
            
            fuseSetter = 
                <div className="form-group fuseSelector">
                    <label>Fusion Options</label>
                    <div className="input-group">
                        <select className="form-control" value={fuseData.type} onChange={this.props.setFuseType.bind(null, pieceN)}>
                            <option value="Critical">Critical</option>
                            <option value="Accuracy">Accuracy</option>
                            <option value="Piercing">Piercing</option>
                            <option value="Health">Health</option>
                            <option value="Defense">Defense</option>
                            <option value="Block">Block</option>
                            <option value="Evasion">Evasion</option>
                            <option value="Critical Defense">Critical Defense</option>
                        </select>
                        <input className="form-control" type="number" value={fuseData.value} onChange={this.props.setFuseValue.bind(null, pieceN, max)} onBlur={this.props.fuseBlur.bind(null, pieceN)}/>
                        <button type="button" className="btn btn-xs btn-success" onClick={this.props.maxFuseValue.bind(null, pieceN, max)}>Max</button>
                    </div>
                </div>
        }
        
        if (pieceData.selectedStat) {
            statGroupIndex = pieceData.selectedStat;
        }
        
        if (pieceData.stats.length > 1) {
            var option = [];
            
            for (var i in pieceData.stats) {
                var str = "Health ",
                    sHealth = 0;
                
                if (pieceData.stats[i].s1Type && pieceData.stats[i].s1Type == "Health") {
                    sHealth += pieceData.stats[statGroupIndex].s1Value*10;
                }

                if (pieceData.stats[i].s2Type && pieceData.stats[i].s2Type == "Health") {
                    sHealth += pieceData.stats[i].s2Value*10;
                }
                
                str += (pieceData.stats[i].mValue + sHealth);
                
                if (pieceData.stats[i].s1Type && pieceData.stats[i].s1Type != "Health") {
                    str += ", " + pieceData.stats[i].s1Type + " " + pieceData.stats[i].s1Value;
                }
                
                if (pieceData.stats[i].s2Type && pieceData.stats[i].s2Type != "Health") {
                    str += ", " + pieceData.stats[i].s2Type + " " + pieceData.stats[i].s2Value;
                }
                
                option.push(
                    <option className={"grade_" + (pieceData.stats[i].modGrade ? pieceData.stats[i].modGrade : set.grade)} value={i}>{str}</option>
                );
            }
            
            statSelector = 
                <div className="form-group">
                    <label>Stat Options</label>
                    <select className="statSelector form-control" value={statGroupIndex} onChange={this.props.setStatGroup.bind(null, tooltip._id, pieceN)}>
                        {option}
                    </select>
                </div>
        }
        if (fuseData && fuseData.type == "Health" && fuseData.value > 0) {
            var sHealth = 0;
                
            if (pieceData.stats[statGroupIndex].s1Type && pieceData.stats[statGroupIndex].s1Type == "Health") {
                sHealth += pieceData.stats[statGroupIndex].s1Value * 10;
            }
            
            if (pieceData.stats[statGroupIndex].s2Type && pieceData.stats[statGroupIndex].s2Type == "Health") {
                sHealth += pieceData.stats[statGroupIndex].s2Value * 10;
            }
            
            var mTotal = parseInt(pieceData.stats[statGroupIndex].mValue) + Math.round(fuseData.value / 10) * 10 + sHealth;
            main = <p className="m modified">{"Health " + mTotal + " (" + pieceData.stats[statGroupIndex].mValue + " + " + Math.round(fuseData.value / 10) * 10 + ")"}</p>;
        }
        else {
            var sHealth = 0;
            
            if (pieceData.stats[statGroupIndex].s1Type && pieceData.stats[statGroupIndex].s1Type == "Health") {
                sHealth += pieceData.stats[statGroupIndex].s1Value * 10;
            }
            
            if (pieceData.stats[statGroupIndex].s2Type && pieceData.stats[statGroupIndex].s2Type == "Health") {
                sHealth += pieceData.stats[statGroupIndex].s2Value * 10;
            }
            
            main = <p className="m">{"Health " + (pieceData.stats[statGroupIndex].mValue + parseInt(sHealth))}</p>;
        }
        
        if (pieceData.stats[statGroupIndex].s1Type && pieceData.stats[statGroupIndex].s1Type != "Health") {
            if (fuseData && pieceData.stats[statGroupIndex].s1Type == fuseData.type && fuseData.value > 0) {
                var s1Total = parseInt(pieceData.stats[statGroupIndex].s1Value) + parseInt(fuseData.value);
                sub1 = <p className="s modified">{pieceData.stats[statGroupIndex].s1Type + " " + s1Total + " (" + pieceData.stats[statGroupIndex].s1Value + " + " + fuseData.value + ")"}</p>
            }
            else {
                sub1 = <p className="s">{pieceData.stats[statGroupIndex].s1Type + " " + pieceData.stats[statGroupIndex].s1Value}</p>
            }
        }
        
        if (pieceData.stats[statGroupIndex].s2Type && pieceData.stats[statGroupIndex].s2Type != "Health") {
            if (fuseData && pieceData.stats[statGroupIndex].s2Type == fuseData.type && fuseData.value > 0) {
                var s2Total = parseInt(pieceData.stats[statGroupIndex].s2Value) + parseInt(fuseData.value);
                sub2 = <p className="s modified">{pieceData.stats[statGroupIndex].s2Type + " " + s2Total + " (" + pieceData.stats[statGroupIndex].s2Value + " + " + fuseData.value + ")"}</p>
            }
            else {
                sub2 = <p className="s">{pieceData.stats[statGroupIndex].s2Type + " " + pieceData.stats[statGroupIndex].s2Value}</p>
            }
        }
        
        if (fuseData && fuseData.value != 0 && fuseData.type != "Health" && fuseData.type != pieceData.stats[statGroupIndex].s1Type && fuseData.type != pieceData.stats[statGroupIndex].s2Type) {
            extra = <p className="s modified">{fuseData.type + " " + fuseData.value}</p>;
        }

        if (tooltip.setEffects[0]) {
            var count = "";
            if (this.props.equipped) {
                count = " (" + this.props.setEffectNumber + "/8)";
            }
        
            var setEffectName = <p className="effectName">{tooltip.setEffects[0].name + count}</p>;
            var setEffects = [];

            for (var e = 1; e <= 3; e++) {
                var effect = null;
                var n = 3;
                switch (e) {
                    case 1: 
                        n = 3;
                        effect = tooltip.setEffects[0].s3;
                        break;
                    case 2:
                        n = 5
                        effect = tooltip.setEffects[0].s5;
                        break;
                    case 3:
                        n = 8
                        effect = tooltip.setEffects[0].s8;
                        break;
                }
                if (effect) {
                    setEffects.push(
                        <div className={"set" + (this.props.setEffectNumber < n ? " inactive" : "")}>
                            <span className="effectLabel">{n}</span>
                            <div className="effectList">{getEffectList(effect)}</div>
                        </div>
                    );
                }
            }
            
            var equippedPieces = null,
                equippedList = [];
            if (this.props.equipped) {
                var pieces = [];
                
                for (var p in this.props.equipData) {
                    if (tooltip._id == this.props.equipData[p]) {
                        pieces.push(
                            <span className={"equipPiece pos_" + (parseInt(p) + 1)}>
                                <img src={"/img/soulshield/equipgem_" + set.iconBase + "_extra_pos" + (parseInt(p) + 1) + ".png"} />
                            </span>
                        );
                    }
                    
                    var grade = "";
                    if (tooltip._id == this.props.equipData[p]) {
                        if (pieceData.stats[tooltip.pieces[p].selectedStat].modGrade) {
                            grade = "grade_" + pieceData.stats[tooltip.pieces[p].selectedStat].modGrade;
                        }
                        else {
                            grade = "grade_" + set.grade;
                        }
                    }
                    
                    equippedList.push(
                    <li className={grade}>{"Soul Shield " + pieceNumSymbol(parseInt(p) + 1) + (parseInt(p) + 1)}</li>
                    );
                }
                
                equippedPieces = <div className="tooltipEquip">{pieces}</div>
            }
            
            setEffectsDiv = 
                <div className="setEffectsDiv">
                    {setEffectName}
                    <ul className="tooltipEquipList">
                        {equippedList}
                    </ul>
                    {equippedPieces}
                    <div className="setEffects">
                        {setEffects}
                    </div>
                </div>;
        }
        
        var locationData = tooltip.acquire;
        if (pieceData.acquire) {
            locationData = pieceData.acquire;
        } 
        for (var a in locationData) {
            acquireList.push(
                <p className="acquireInfo">
                    <img height="20" width="20" className="cond-icon" src={"/img/" + locationData[a].image + ".png"} alt="acq-icon"></img>
                    <span className={locationData[a].type}>{locationData[a].location}</span>
                </p>
            );
        }
        
        
        var flavor = null;
        if (tooltip.flavor) {
            flavor = <p className="flavor">"{tooltip.flavor}"</p>;
        }
        
        var classLimit = null;
        if (tooltip.classLimit) {
            classLimit = <p>{tooltip.classLimit + " only"}</p>;
        }
        
        return (
            <div className="tooltipWraper">
                <h3 className={"name grade_" + (pieceData.stats[statGroupIndex].modGrade ? pieceData.stats[statGroupIndex].modGrade : set.grade)}>{set.name + " " + pieceNumSymbol(pieceN) + pieceN}</h3>
                {equipped}
                <br />
                <span className="thumb">
                    <img src={"/img/soulshield/equipgem_" + set.iconBase + "_pos" + pieceN + "_" + (pieceData.stats[statGroupIndex].modGrade ? pieceData.stats[statGroupIndex].modGrade : set.grade) + "_1.png"} />
                </span>
                <span className="stats">
                    {main}
                    {sub1}
                    {sub2}
                    {extra}
                </span>
                <p className="maxFuse">Maximum Fusion Value <span className="fuseValue">{pieceData.stats[statGroupIndex].modFuse ? pieceData.stats[statGroupIndex].modFuse : pieceData.maxFuse}</span></p>
                {setEffectsDiv}
                <div className="acquireDiv">
                    <span>Acquired from</span>
                    {acquireList}
                </div>
                {flavor}
                <p>{"Requires level " + (pieceData.stats[statGroupIndex].modLevel ? pieceData.stats[statGroupIndex].modLevel : set.level)}</p>
                {classLimit}
                <p>{"Bind on " + tooltip.bind}</p>
                <hr />
                {statSelector}
                {fuseSetter}
            </div>
        );
    }
});


if (isNode) {
    exports.Mixer = Mixer
} else {
    ReactDOM.render(
        <Mixer />,
        document.getElementById('mixer-wrap')
    );
}