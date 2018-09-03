'use strict';

var isNode = typeof module !== 'undefined' && module.exports,
    React = isNode ? require('react') : window.React,
    ReactDOM = isNode ? require('react') : window.ReactDOM;

var cancelScrollEvent = function cancelScrollEvent(e) {
    e.stopImmediatePropagation();
    e.preventDefault();
    e.returnValue = false;
};

var addScrollEventListener = function addScrollEventListener(elem, handler) {
    elem.addEventListener('wheel', handler, false);
};

var removeScrollEventListener = function removeScrollEventListener(elem, handler) {
    elem.removeEventListener('wheel', handler, false);
};

var ScrollLockMixin = {
    scrollLock: function scrollLock(elem) {
        elem = elem || ReactDOM.findDOMNode(this);
        this.scrollElem = elem;
        addScrollEventListener(elem, this.onScrollHandler);
    },

    scrollRelease: function scrollRelease(elem) {
        elem = elem || this.scrollElem;
        removeScrollEventListener(elem, this.onScrollHandler);
    },

    onScrollHandler: function onScrollHandler(e) {
        var elem = this.scrollElem;
        var scrollTop = elem.scrollTop;
        var scrollHeight = elem.scrollHeight;
        var height = elem.clientHeight;
        var wheelDelta = e.deltaY;
        var isDeltaPositive = wheelDelta > 0;

        if (isDeltaPositive && wheelDelta > scrollHeight - height - scrollTop) {
            elem.scrollTop = scrollHeight;
            return cancelScrollEvent(e);
        } else if (!isDeltaPositive && -wheelDelta > scrollTop) {
            elem.scrollTop = 0;
            return cancelScrollEvent(e);
        }
    }
};

function searchById(arr, id) {
    var index = arr.map(function (x) {
        return x._id;
    }).indexOf(id);
    return arr[index];
}

var Evolver = React.createClass({
    displayName: 'Evolver',

    getInitialState: function getInitialState() {
        return {
            listData: null,
            tooltipCache: [],
            selectedListEntry: null,
            selectedListItemEntry: null,
            itemType: "weapon",
            itemClass: "BM",
            stage: 1
        };
    },
    componentDidMount: function componentDidMount() {
        var t = this;
        $.post('/evolver/data', { itemType: t.state.itemType }, function (data, status) {
            t.state.tooltipCache.push(data[1]);

            t.setState({
                listData: data[0],
                selectedListEntry: data[0][0]._id,
                selectedListItemEntry: data[0][0].tree[0]._id,
                tooltipCache: t.state.tooltipCache
            });
        });
    },
    switchType: function switchType(n, e) {
        e.preventDefault();

        var type = "weapon",
            t = this;
        switch (n) {
            case 0:
                type = "weapon";
                break;
            case 1:
                type = "accessory";
                break;
            case 2:
                type = "misc";
                break;
        }

        if (this.state.itemType != type) {
            $.post('/evolver/data', { itemType: type }, function (data, status) {

                var temp1 = null,
                    temp2 = null;
                if (data[0].length > 0) {
                    temp1 = data[0][0]._id;
                    temp2 = data[0][0].tree[0]._id;
                }

                if (data[1]) {
                    t.state.tooltipCache.push(data[1]);
                }

                t.setState({
                    itemType: type,
                    listData: data[0],
                    selectedListEntry: temp1,
                    selectedListItemEntry: temp2,
                    tooltipCache: t.state.tooltipCache,
                    stage: 1
                });
            });
        }
    },
    selectTree: function selectTree(id, i_id) {
        this.setState({
            selectedListEntry: id,
            selectedListItemEntry: i_id,
            stage: 1
        });
    },
    selectItem: function selectItem(tree_id, id, stage, e) {
        e.preventDefault();

        var tooltip = searchById(this.state.tooltipCache, id);
        var t = this;

        if (tooltip && id != this.state.selectedListItemEntry) {
            t.setState({
                selectedListEntry: tree_id,
                selectedListItemEntry: id,
                stage: stage
            });
        } else if (id != this.state.selectedListItemEntry) {
            $.post('/evolver/tooltipData', { id: id }, function (data, status) {
                t.state.tooltipCache.push(data);

                t.setState({
                    tooltipCache: t.state.tooltipCache,
                    selectedListEntry: tree_id,
                    selectedListItemEntry: id,
                    stage: stage
                });
            });
        }
    },
    selectStage: function selectStage(stage) {
        this.setState({
            stage: stage
        });
    },
    setItemClass: function setItemClass(e) {
        this.setState({
            itemClass: e.target.value
        });
    },
    render: function render() {
        var itemListData = null,
            itemTooltipData = null,
            suffix = "",
            imgType = "default";

        if (this.state.listData) {
            itemTooltipData = searchById(this.state.tooltipCache, this.state.selectedListItemEntry);

            var temp = searchById(this.state.listData, this.state.selectedListEntry);
            if (temp && temp.tree) {
                itemListData = searchById(temp.tree, this.state.selectedListItemEntry);
            } else {
                itemListData = temp;
            }
        }

        if (this.state.itemType == "weapon") {
            switch (this.state.itemClass) {
                case "BM":
                    suffix = "Sword";
                    imgType = "sw";
                    break;
                case "KF":
                    suffix = "Gauntlet";
                    imgType = "gt";
                    break;
                case "DE":
                    suffix = "Axe";
                    imgType = "ta";
                    break;
                case "FM":
                    suffix = "Bangle";
                    imgType = "ab";
                    break;
                case "AS":
                    suffix = "Dagger";
                    imgType = "dg";
                    break;
                case "SU":
                    suffix = "Staff";
                    imgType = "st";
                    break;
                case "BD":
                    suffix = "Lyn Sword";
                    imgType = "sw";
                    break;
                case "WL":
                    suffix = "Razor";
                    imgType = "dg";
                    break;
                case "SF":
                    suffix = "Force Gauntlet";
                    imgType = "gt";
                    break;
            }
        }

        return React.createElement(
            'div',
            null,
            React.createElement(
                'nav',
                { className: 'navbar navbar-inverse navbar-static-top itemNav' },
                React.createElement(
                    'div',
                    { className: 'container-fluid' },
                    React.createElement(
                        'div',
                        { className: 'navbar-header' },
                        React.createElement(
                            'h1',
                            { className: 'subtitle' },
                            'Item Evolver ',
                            React.createElement(
                                'small',
                                null,
                                'Beta'
                            )
                        )
                    ),
                    React.createElement(
                        'ul',
                        { className: 'nav navbar-nav typeMenu' },
                        React.createElement(
                            'li',
                            { className: this.state.itemType == "weapon" ? " active" : "" },
                            React.createElement(
                                'a',
                                { href: '#', onClick: this.switchType.bind(null, 0) },
                                React.createElement('img', { width: '20', src: '/img/Inventory_Weapon.png' }),
                                ' Weapon'
                            )
                        ),
                        React.createElement(
                            'li',
                            { className: this.state.itemType == "accessory" ? " active" : "" },
                            React.createElement(
                                'a',
                                { href: '#', onClick: this.switchType.bind(null, 1) },
                                React.createElement('img', { width: '20', src: '/img/Inventory_Acc.png' }),
                                ' Acessory'
                            )
                        ),
                        React.createElement(
                            'li',
                            { className: this.state.itemType == "misc" ? " active" : "" },
                            React.createElement(
                                'a',
                                { href: '#', onClick: this.switchType.bind(null, 2) },
                                React.createElement('img', { width: '20', src: '/img/Inventory_Etc.png' }),
                                ' Misc.'
                            )
                        )
                    )
                )
            ),
            React.createElement(ItemList, {
                listData: this.state.listData,
                selectedListEntry: this.state.selectedListEntry,
                selectedListItemEntry: this.state.selectedListItemEntry,
                suffix: suffix,
                imgType: imgType,
                itemClass: this.state.itemClass,
                itemType: this.state.itemType,

                selectItem: this.selectItem,
                selectTree: this.selectTree,
                setItemClass: this.setItemClass
            }),
            React.createElement(
                'div',
                { className: 'tooltipTreeWrap col-lg-9' },
                React.createElement(ItemTree, {
                    itemListData: itemListData,
                    itemTooltipData: itemTooltipData,
                    treeId: this.state.selectedListEntry,
                    imgType: imgType,
                    stage: this.state.stage,

                    selectItem: this.selectItem,
                    selectStage: this.selectStage
                }),
                React.createElement(ItemTooltip, {
                    listData: this.state.listData,
                    itemListData: itemListData,
                    itemTooltipData: itemTooltipData,
                    treeId: this.state.selectedListEntry,
                    suffix: suffix,
                    imgType: imgType,
                    itemType: this.state.itemType,
                    itemClass: this.state.itemClass,
                    stage: this.state.stage,

                    selectItem: this.selectItem
                })
            )
        );
    }
});

var ItemList = React.createClass({
    displayName: 'ItemList',

    getInitialState: function getInitialState() {
        return {
            filterInput: "",
            minLevel: 0,
            maxLevel: 45,
            filterSuperior: true,
            filterHeroic: true,
            filterLegendary: true,
            filterMode: false
        };
    },
    handleFilterInput: function handleFilterInput(e) {
        this.setState({
            filterInput: e.target.value
        });
    },
    handleLevelInput: function handleLevelInput(type, e) {
        var value = e.target.value;
        if (!isNaN(value) && value >= 0 && value <= 50) {
            if (type == "min") {
                this.setState({
                    minLevel: value
                });
            } else {
                this.setState({
                    maxLevel: value
                });
            }
        }
    },
    blurLv: function blurLv(type, e) {
        if (e.target.value == "") {
            if (type == "min") {
                this.setState({
                    minLevel: 0
                });
            } else {
                this.setState({
                    maxLevel: 50
                });
            }
        }
    },
    clearFilter: function clearFilter(e) {
        this.setState({
            filterInput: ""
        });
    },
    checkAll: function checkAll(b) {
        if (b) {
            this.setState({
                filterSuperior: true,
                filterHeroic: true,
                filterLegendary: true
            });
        } else {
            this.setState({
                filterSuperior: false,
                filterHeroic: false,
                filterLegendary: false
            });
        }
    },
    gradeFilter: function gradeFilter(g) {
        switch (g) {
            case 4:
                this.setState({
                    filterSuperior: !this.state.filterSuperior
                });
                break;
            case 5:
                this.setState({
                    filterHeroic: !this.state.filterHeroic
                });
                break;
            case 7:
                this.setState({
                    filterLegendary: !this.state.filterLegendary
                });
                break;
        }
    },
    render: function render() {
        var listData = this.props.listData,
            treeEntries = [],
            itemEntries = [],
            input = this.state.filterInput.toLowerCase().trim();

        for (var l in listData) {
            var entryData = listData[l];
            if (entryData.tree && this.state.maxLevel >= entryData.level && entryData.type == this.props.itemType) {
                var treeItems = [],
                    treeImage = this.props.itemType + "_" + this.props.imgType + "_" + entryData.tree[0].image[this.props.imgType] + "_" + entryData.tree[0].grade + "_1",
                    treeSelected = this.props.selectedListEntry == entryData._id,
                    filtering = false,
                    treeItemsDiv = null;

                if (treeSelected) {
                    for (var n in entryData.tree) {
                        var treeItem = entryData.tree[n],
                            itemName = treeItem.name + " " + this.props.suffix,
                            inputCheck = input == "" || itemName.toLowerCase().startsWith(input),
                            levelCheck = this.state.minLevel <= treeItem.level && this.state.maxLevel >= treeItem.level,
                            gradeCheck = this.state.filterSuperior && treeItem.grade == 4 || this.state.filterHeroic && treeItem.grade == 5 || this.state.filterLegendary && treeItem.grade == 7;

                        if (inputCheck && levelCheck && gradeCheck) {
                            var itemSelected = this.props.selectedListItemEntry == treeItem._id,
                                image = this.props.itemType + "_" + this.props.imgType + "_" + treeItem.image[this.props.imgType] + "_" + treeItem.grade + "_1";

                            treeItems.push(React.createElement(
                                'li',
                                { className: "itemListEntry subEntry" + (itemSelected ? " selected" : ""), onClick: this.props.selectItem.bind(null, entryData._id, treeItem._id, 1) },
                                React.createElement(
                                    'span',
                                    { className: 'thumb' },
                                    React.createElement('img', { src: "/img/" + this.props.itemType + "/" + image + ".png" })
                                ),
                                React.createElement(
                                    'span',
                                    { className: "name grade_" + treeItem.grade },
                                    itemName
                                )
                            ));
                        } else {
                            filtering = true;
                        }
                    }

                    treeItemsDiv = React.createElement(
                        'div',
                        { className: 'subEntryDiv' },
                        treeItems
                    );
                }

                if (!(treeItems.length == 0 && filtering)) {
                    treeEntries.push(React.createElement(
                        'div',
                        { className: 'entryWraper' },
                        React.createElement(
                            'li',
                            { className: "itemTreeEntry" + (treeSelected ? " selected" : ""), onClick: this.props.selectTree.bind(null, entryData._id, entryData.tree[0]._id) },
                            React.createElement(
                                'span',
                                { className: 'thumb' },
                                React.createElement('img', { src: "/img/" + this.props.itemType + "/" + treeImage + ".png" })
                            ),
                            React.createElement(
                                'span',
                                { className: 'name' },
                                entryData.name
                            )
                        ),
                        treeItemsDiv
                    ));
                }
            } else if (entryData.type == this.props.itemType) {
                var treeItem = entryData,
                    itemName = treeItem.name + " " + this.props.suffix,
                    inputCheck = input == "" || itemName.toLowerCase().startsWith(input),
                    levelCheck = this.state.minLevel <= treeItem.level && this.state.maxLevel >= treeItem.level,
                    gradeCheck = this.state.filterSuperior && treeItem.grade == 4 || this.state.filterHeroic && treeItem.grade == 5 || this.state.filterLegendary && treeItem.grade == 7;

                if (inputCheck && levelCheck && gradeCheck) {
                    var itemSelected = this.props.selectedListItemEntry == treeItem._id,
                        image = this.props.itemType + "_" + this.props.imgType + "_" + treeItem.image[this.props.imgType] + "_" + treeItem.grade + "_1";

                    itemEntries.push(React.createElement(
                        'li',
                        { className: "itemListEntry subEntry" + (itemSelected ? " selected" : ""), onClick: this.props.selectItem.bind(null, entryData._id, treeItem._id, 1) },
                        React.createElement(
                            'span',
                            { className: 'thumb' },
                            React.createElement('img', { src: "/img/" + this.props.itemType + "/" + image + ".png" })
                        ),
                        React.createElement(
                            'span',
                            { className: "name grade_" + treeItem.grade },
                            itemName
                        )
                    ));
                }
            }
        }

        var clear = null;
        if (this.state.filterInput != "") {
            clear = React.createElement('span', { className: 'glyphicon glyphicon-remove', 'aria-hidden': 'true', onClick: this.clearFilter });
        }
        var allChecked = this.state.filterSuperior && this.state.filterHeroic && this.state.filterLegendary;

        var weaponFilter = null;
        if (this.props.itemType == "weapon") {
            weaponFilter = React.createElement(
                'div',
                { className: 'form-group itemClassSelect' },
                React.createElement(
                    'label',
                    null,
                    'Class'
                ),
                React.createElement(
                    'select',
                    { className: 'form-control', value: this.props.itemClass, onChange: this.props.setItemClass },
                    React.createElement(
                        'option',
                        { value: 'BM' },
                        'Blade Master'
                    ),
                    React.createElement(
                        'option',
                        { value: 'KF' },
                        'Kung Fu Master'
                    ),
                    React.createElement(
                        'option',
                        { value: 'DE' },
                        'Destroyer'
                    ),
                    React.createElement(
                        'option',
                        { value: 'FM' },
                        'Force Master'
                    ),
                    React.createElement(
                        'option',
                        { value: 'AS' },
                        'Assassin'
                    ),
                    React.createElement(
                        'option',
                        { value: 'SU' },
                        'Summoner'
                    ),
                    React.createElement(
                        'option',
                        { value: 'BD' },
                        'Blade Dancer'
                    ),
                    React.createElement(
                        'option',
                        { value: 'WL' },
                        'Warlock'
                    ),
                    React.createElement(
                        'option',
                        { value: 'SF' },
                        'Soul Fighter'
                    )
                )
            );
        }
        return React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                { className: 'listFilter form-inline' },
                React.createElement(
                    'form',
                    { className: 'navbar-form' },
                    React.createElement(
                        'div',
                        { className: 'form-group searchInput' },
                        React.createElement('input', { value: this.state.filterInput, onChange: this.handleFilterInput, type: 'text', className: 'form-control', placeholder: 'Search' }),
                        clear
                    ),
                    React.createElement(
                        'div',
                        { className: 'form-group levelInput' },
                        React.createElement(
                            'label',
                            null,
                            'Level'
                        ),
                        React.createElement('input', { value: this.state.minLevel, onChange: this.handleLevelInput.bind(null, "min"), onBlur: this.blurLv.bind(null, "min"), type: 'number', className: 'form-control' })
                    ),
                    React.createElement(
                        'div',
                        { className: 'form-group levelInput' },
                        React.createElement(
                            'label',
                            null,
                            '~'
                        ),
                        React.createElement('input', { value: this.state.maxLevel, onChange: this.handleLevelInput.bind(null, "max"), onBlur: this.blurLv.bind(null, "max"), type: 'number', className: 'form-control' })
                    ),
                    React.createElement(
                        'div',
                        { className: 'gradeFilters' },
                        React.createElement(
                            'div',
                            { className: 'checkbox' },
                            React.createElement(
                                'label',
                                null,
                                React.createElement('input', { type: 'checkbox', checked: allChecked, onChange: this.checkAll.bind(null, !allChecked) }),
                                'All'
                            )
                        ),
                        React.createElement(
                            'div',
                            { className: 'checkbox' },
                            React.createElement(
                                'label',
                                { className: 'grade_4' },
                                React.createElement('input', { type: 'checkbox', checked: this.state.filterSuperior, onChange: this.gradeFilter.bind(null, 4) }),
                                'Superior'
                            )
                        ),
                        React.createElement(
                            'div',
                            { className: 'checkbox' },
                            React.createElement(
                                'label',
                                { className: 'grade_5' },
                                React.createElement('input', { type: 'checkbox', checked: this.state.filterHeroic, onChange: this.gradeFilter.bind(null, 5) }),
                                'Heroic'
                            )
                        ),
                        React.createElement(
                            'div',
                            { className: 'checkbox' },
                            React.createElement(
                                'label',
                                { className: 'grade_7' },
                                React.createElement('input', { type: 'checkbox', checked: this.state.filterLegendary, onChange: this.gradeFilter.bind(null, 7) }),
                                'Legendary'
                            )
                        )
                    ),
                    weaponFilter
                )
            ),
            React.createElement(ItemListContent, {
                weaponList: this.props.itemType == "weapon",
                trees: treeEntries,
                items: itemEntries
            })
        );
    }
});

var ItemListContent = React.createClass({
    displayName: 'ItemListContent',

    mixins: [ScrollLockMixin],
    componentDidMount: function componentDidMount() {
        this.scrollLock();
    },
    render: function render() {
        return React.createElement(
            'div',
            { className: "itemList col-lg-3" + (this.props.weaponList ? " weaponList" : ""), onScroll: this.preventScroll },
            React.createElement(
                'dl',
                { className: 'itemGroup' },
                React.createElement(
                    'dt',
                    null,
                    React.createElement(
                        'strong',
                        null,
                        'Item Trees'
                    )
                ),
                React.createElement(
                    'dd',
                    null,
                    this.props.trees
                )
            ),
            React.createElement(
                'dl',
                { className: 'itemGroup' },
                React.createElement(
                    'dt',
                    null,
                    React.createElement(
                        'strong',
                        null,
                        'Other Items'
                    )
                ),
                React.createElement(
                    'dd',
                    null,
                    this.props.items
                )
            ),
            React.createElement('li', { className: 'buffer' })
        );
    }
});

var ItemTree = React.createClass({
    displayName: 'ItemTree',

    render: function render() {
        var tooltip = this.props.itemTooltipData,
            list = this.props.itemListData;
        if (tooltip && tooltip.stats.length > 1) {
            var prev = null,
                next = null,
                treeEntries = [];

            if (tooltip.prev) {
                prev = React.createElement(
                    'div',
                    { className: 'prev', onClick: this.props.selectItem.bind(null, this.props.treeId, tooltip.prev, 10) },
                    React.createElement('span', { className: 'glyphicon glyphicon-menu-left', 'aria-hidden': 'true' })
                );
            }

            if (tooltip.next) {
                next = React.createElement(
                    'div',
                    { className: 'next', onClick: this.props.selectItem.bind(null, this.props.treeId, tooltip.next, 1) },
                    React.createElement('span', { className: 'glyphicon glyphicon-menu-right', 'aria-hidden': 'true' })
                );
            }

            for (var t = 1; t <= tooltip.stats.length; t++) {
                treeEntries.push(React.createElement(
                    'span',
                    { className: "treeEntry" + (t == this.props.stage ? " selected" : ""), onClick: this.props.selectStage.bind(null, t) },
                    React.createElement('img', { src: "/img/item-overlay" + (t == 10 ? t + "max" : t) + ".png" })
                ));

                treeEntries.push(React.createElement('span', { className: "treeLine" + (t < this.props.stage ? " filled" : "") }));
            }

            return React.createElement(
                'div',
                { className: 'itemTree' },
                prev,
                React.createElement(
                    'div',
                    { className: 'tree' },
                    treeEntries.slice(0, -1)
                ),
                next
            );
        } else {
            return React.createElement('div', null);
        }
    }
});

var ItemTooltip = React.createClass({
    displayName: 'ItemTooltip',

    refineDiv: function refineDiv(refineData, type) {
        if (type == "Breakthrough" || type == "Transform") {
            var tempData = searchById(this.props.listData, refineData.amplifier),
                ingredients = [],
                cost = [];

            for (var i in refineData.ingredients) {
                var ing = refineData.ingredients[i];

                ingredients.push(React.createElement(
                    'p',
                    { className: 'ingredient' },
                    React.createElement('img', { height: '30', width: '30', src: "/img/misc/" + ing.image + ".png" }),
                    React.createElement(
                        'span',
                        { className: "grade_" + ing.grade },
                        ing.item
                    ),
                    ' ',
                    React.createElement(
                        'span',
                        null,
                        "x" + ing.amount
                    )
                ));
            }

            if (refineData.cost[0] > 0) {
                cost.push(React.createElement(
                    'span',
                    null,
                    refineData.cost[0],
                    React.createElement('img', { height: '20', width: '20', src: '/img/money_gold.png' })
                ));
            }

            if (refineData.cost[1] > 0) {
                cost.push(React.createElement(
                    'span',
                    null,
                    refineData.cost[1],
                    React.createElement('img', { height: '20', width: '20', src: '/img/money_silver.png' })
                ));
            }

            if (refineData.cost[2] > 0) {
                cost.push(React.createElement(
                    'span',
                    null,
                    refineData.cost[2],
                    React.createElement('img', { height: '20', width: '20', src: '/img/money_copper.png' })
                ));
            }

            var at = null;
            if (type == "Breakthrough") {
                at = React.createElement(
                    'small',
                    null,
                    'At Stage 5 ',
                    React.createElement('img', { height: '20', width: '20', src: '/img/item-overlay5max.png' })
                );
            } else {
                var tempData2 = searchById(searchById(this.props.listData, this.props.treeId).tree, refineData.to);

                at = React.createElement(
                    'small',
                    null,
                    'At Stage 10 ',
                    React.createElement('img', { height: '20', width: '20', src: '/img/item-overlay10max.png' }),
                    ' to ',
                    React.createElement('img', { height: '20', width: '20', src: "/img/" + this.props.itemType + "/" + this.props.itemType + "_" + this.props.imgType + "_" + tempData2.image[this.props.imgType] + "_" + tempData2.grade + "_1.png" }),
                    ' ',
                    React.createElement(
                        'a',
                        { href: '#', className: "grade_" + tempData2.grade, onClick: this.props.selectItem.bind(null, this.props.treeId, tempData2._id, 1) },
                        tempData2.name + " " + this.props.suffix + " - Stage 1"
                    )
                );
            }

            return React.createElement(
                'div',
                { className: 'refineDiv' },
                React.createElement(
                    'h4',
                    null,
                    type,
                    ' ',
                    at
                ),
                React.createElement(
                    'div',
                    { className: 'refine' },
                    React.createElement(
                        'h5',
                        null,
                        'Amplifier'
                    ),
                    React.createElement(
                        'div',
                        { className: 'amplifier' },
                        React.createElement('img', { height: '45', width: '45', src: "/img/" + this.props.itemType + "/" + this.props.itemType + "_" + this.props.imgType + "_" + tempData.image[this.props.imgType] + "_" + tempData.grade + "_1.png" }),
                        React.createElement(
                            'a',
                            { href: '#', className: "grade_" + tempData.grade, onClick: this.props.selectItem.bind(null, refineData.amplifier, tempData._id, 1) },
                            tempData.name + " " + this.props.suffix
                        )
                    ),
                    React.createElement(
                        'h5',
                        null,
                        'Ingredients'
                    ),
                    React.createElement(
                        'div',
                        { className: 'ingredientList' },
                        ingredients
                    ),
                    React.createElement(
                        'h5',
                        null,
                        'Base Cost'
                    ),
                    React.createElement(
                        'div',
                        { className: 'cost' },
                        cost
                    )
                )
            );
        } else {
            var refineLv = null,
                breakthrough = null,
                transform = null;

            if (refineData.breakthrough) {
                var tempData = searchById(searchById(this.props.listData, refineData.breakthrough[0]).tree, refineData.breakthrough[1]);

                breakthrough = React.createElement(
                    'div',
                    { className: 'amplifier noindent' },
                    React.createElement('img', { height: '20', width: '20', src: "/img/tooltip_breakmaterial.png" }),
                    React.createElement(
                        'span',
                        null,
                        'Breakthrough amplifier for '
                    ),
                    React.createElement('img', { height: '20', width: '20', src: "/img/" + this.props.itemType + "/" + this.props.itemType + "_" + this.props.imgType + "_" + tempData.image[this.props.imgType] + "_" + tempData.grade + "_1.png" }),
                    React.createElement(
                        'a',
                        { href: '#', className: "grade_" + tempData.grade, onClick: this.props.selectItem.bind(null, refineData.breakthrough[0], tempData._id, 1) },
                        tempData.name + " " + this.props.suffix
                    )
                );
            }

            if (refineData.transform) {
                var treeData = searchById(this.props.listData, refineData.transform[0]).tree,
                    withData = searchById(treeData, refineData.transform[1]),
                    toData = searchById(treeData, refineData.transform[2]);

                transform = React.createElement(
                    'div',
                    { className: 'amplifier noindent' },
                    React.createElement('img', { height: '20', width: '20', src: "/img/tooltip_growth.png" }),
                    React.createElement(
                        'span',
                        null,
                        'Transform amplifier for '
                    ),
                    React.createElement('img', { height: '20', width: '20', src: "/img/" + this.props.itemType + "/" + this.props.itemType + "_" + this.props.imgType + "_" + withData.image[this.props.imgType] + "_" + withData.grade + "_1.png" }),
                    React.createElement(
                        'a',
                        { href: '#', className: "grade_" + withData.grade, onClick: this.props.selectItem.bind(null, refineData.transform[0], withData._id, 1) },
                        withData.name + " " + this.props.suffix
                    ),
                    React.createElement(
                        'span',
                        null,
                        ' to '
                    ),
                    React.createElement('img', { height: '20', width: '20', src: "/img/" + this.props.itemType + "/" + this.props.itemType + "_" + this.props.imgType + "_" + toData.image[this.props.imgType] + "_" + toData.grade + "_1.png" }),
                    React.createElement(
                        'a',
                        { href: '#', className: "grade_" + toData.grade, onClick: this.props.selectItem.bind(null, refineData.transform[0], toData._id, 1) },
                        toData.name + " " + this.props.suffix
                    )
                );
            }

            if (refineData.lv) {
                refineLv = React.createElement(
                    'div',
                    { className: 'amplifier noindent' },
                    React.createElement('img', { height: '20', width: '20', src: "/img/tooltip_growthexp.png" }),
                    React.createElement(
                        'span',
                        null,
                        "Refinement amplifier for level " + refineData.lv[0] + "~" + refineData.lv[1] + " weapons"
                    )
                );
            } else {
                refineLv = React.createElement(
                    'div',
                    { className: 'amplifier noindent' },
                    React.createElement('img', { height: '20', width: '20', src: "/img/tooltip_warning.png" }),
                    React.createElement(
                        'span',
                        null,
                        'Cannot be used as refinement amplifier'
                    )
                );
            }

            return React.createElement(
                'div',
                { className: 'refineDiv' },
                React.createElement(
                    'h4',
                    null,
                    type
                ),
                React.createElement(
                    'div',
                    { className: 'refine' },
                    breakthrough,
                    transform,
                    refineLv
                )
            );
        }
    },
    render: function render() {
        var tooltip = this.props.itemTooltipData,
            list = this.props.itemListData,
            itemList = this.props.listData,
            stage = "",
            imgStage = null,
            main = "",
            sub = [],
            extra = [],
            acquireList = [],
            classLimit = null,
            flavor = null,
            gem = [],
            gemExtra = [];

        if (list) {
            var image = this.props.itemType + "_" + this.props.imgType + "_" + list.image[this.props.imgType] + "_" + list.grade + "_1",
                stats = tooltip.stats[this.props.stage - 1];

            if (tooltip.stats.length > 1) {
                stage = " - Stage " + this.props.stage;
                imgStage = React.createElement('img', { className: 'stageOverlay', src: "/img/item-overlay" + (this.props.stage == 10 ? this.props.stage + "max" : this.props.stage) + ".png" });
            }

            main = React.createElement(
                'p',
                { className: 'm' },
                "Attack " + stats.mValue
            );

            for (var s in stats.sub) {
                sub.push(React.createElement(
                    'p',
                    { className: 's' },
                    stats.sub[s].type + " " + stats.sub[s].value
                ));
            }

            for (var e in stats.effects) {
                extra.push(React.createElement(
                    'p',
                    { className: 'e' },
                    stats.effects[e].text
                ));
            }

            for (var a in tooltip.acquire) {
                if (tooltip.acquire[a].evolve) {
                    var i = [];

                    for (var v in tooltip.acquire[a].evolve) {
                        if (tooltip.acquire[a].evolve[v].tree) {
                            var tempData = searchById(searchById(itemList, tooltip.acquire[a].evolve[v].tree).tree, tooltip.acquire[a].evolve[v].tree);

                            i.push(React.createElement(
                                'span',
                                null,
                                React.createElement('img', { height: '20', width: '20', src: "/img/" + this.props.itemType + "/" + this.props.itemType + "_" + this.props.imgType + "_" + tempData.image[this.props.imgType] + "_" + tempData.grade + "_1.png" }),
                                React.createElement(
                                    'a',
                                    { href: '#', className: "grade_" + tempData.grade, onClick: this.props.selectItem.bind(null, tooltip.acquire[a].evolve[v].tree, tempData._id, tooltip.acquire[a].evolve[v].stage) },
                                    tempData.name + " " + this.props.suffix + " - Stage " + tooltip.acquire[a].evolve[v].stage
                                )
                            ));

                            i.push(React.createElement(
                                'span',
                                null,
                                ' + '
                            ));
                        } else {
                            var tempData = searchById(itemList, tooltip.acquire[a].evolve[v].id);

                            i.push(React.createElement(
                                'span',
                                null,
                                React.createElement('img', { height: '20', width: '20', src: "/img/" + this.props.itemType + "/" + this.props.itemType + "_" + this.props.imgType + "_" + tempData.image[this.props.imgType] + "_" + tempData.grade + "_1.png" }),
                                React.createElement(
                                    'a',
                                    { href: '#', className: "grade_" + tempData.grade, onClick: this.props.selectItem.bind(null, tooltip.acquire[a].evolve[v].id, tempData._id, 1) },
                                    tempData.name + " " + this.props.suffix
                                )
                            ));

                            i.push(React.createElement(
                                'span',
                                null,
                                ' + '
                            ));
                        }
                    }

                    acquireList.push(React.createElement(
                        'p',
                        { className: 'acquireInfo' },
                        React.createElement('img', { height: '20', width: '20', className: 'cond-icon', src: "/img/" + tooltip.acquire[a].image + ".png", alt: 'acq-icon' }),
                        i.slice(0, -1)
                    ));
                } else {
                    acquireList.push(React.createElement(
                        'p',
                        { className: 'acquireInfo' },
                        React.createElement('img', { height: '20', width: '20', className: 'cond-icon', src: "/img/" + tooltip.acquire[a].image + ".png", alt: 'acq-icon' }),
                        React.createElement(
                            'span',
                            { className: tooltip.acquire[a].type },
                            tooltip.acquire[a].location
                        )
                    ));
                }
            }

            for (var g = 0; g < tooltip.initialSlots; g++) {
                gem.push(React.createElement('img', { className: 'slot', src: '/img/gemslot_0_normal.png' }));
            }

            switch (this.props.itemClass) {
                case "BM":
                    classLimit = React.createElement(
                        'p',
                        null,
                        'Blade Master only'
                    );
                    break;
                case "KF":
                    classLimit = React.createElement(
                        'p',
                        null,
                        'Kung Fu Master only'
                    );
                    break;
                case "DE":
                    classLimit = React.createElement(
                        'p',
                        null,
                        'Destroyer Master only'
                    );
                    break;
                case "FM":
                    classLimit = React.createElement(
                        'p',
                        null,
                        'Force Master only'
                    );
                    break;
                case "AS":
                    classLimit = React.createElement(
                        'p',
                        null,
                        'Assassin only'
                    );
                    break;
                case "SU":
                    classLimit = React.createElement(
                        'p',
                        null,
                        'Summoner only'
                    );
                    break;
                case "BD":
                    classLimit = React.createElement(
                        'p',
                        null,
                        'Blade Dancer only'
                    );
                    break;
                case "WL":
                    classLimit = React.createElement(
                        'p',
                        null,
                        'Warlock only'
                    );
                    break;
                case "SF":
                    classLimit = React.createElement(
                        'p',
                        null,
                        'Soul Fighter only'
                    );
                    break;
            }

            var skin1 = tooltip.skin[0] ? "Can be skinned" : "Cannot be skinned",
                skin2 = tooltip.skin[1] ? "can be used as a skin" : "cannot be used as a skin";

            var refine = [];
            if (tooltip.breakthrough) {
                refine.push(this.refineDiv(tooltip.breakthrough, "Breakthrough"));
                refine.push(React.createElement('hr', null));
            }

            if (tooltip.transform) {
                refine.push(this.refineDiv(tooltip.transform, "Transform"));
                refine.push(React.createElement('hr', null));
            }

            if (tooltip.amplifier) {
                refine.push(this.refineDiv(tooltip.amplifier, "Amplifier"));
                refine.push(React.createElement('hr', null));
            }

            return React.createElement(
                'div',
                { className: 'itemTooltip' },
                React.createElement(
                    'div',
                    { className: 'subTooltip1 col-sm-6' },
                    React.createElement(
                        'h3',
                        { className: "name grade_" + list.grade },
                        list.name + " " + this.props.suffix + stage
                    ),
                    React.createElement(
                        'span',
                        { className: 'thumb' },
                        imgStage,
                        React.createElement('img', { src: "/img/" + this.props.itemType + "/" + image + ".png" })
                    ),
                    React.createElement(
                        'span',
                        { className: 'stats' },
                        main,
                        sub
                    ),
                    React.createElement(
                        'div',
                        { className: 'effects' },
                        extra
                    ),
                    React.createElement(
                        'div',
                        { className: 'gemDiv' },
                        gem,
                        React.createElement(
                            'p',
                            null,
                            "Maximum Gem Slots: " + tooltip.maxSlots
                        ),
                        gemExtra
                    ),
                    React.createElement(
                        'div',
                        { className: 'acquireDiv' },
                        React.createElement(
                            'span',
                            null,
                            'Acquired from'
                        ),
                        acquireList
                    ),
                    flavor,
                    React.createElement(
                        'p',
                        null,
                        "Requires level " + list.level
                    ),
                    classLimit,
                    React.createElement(
                        'p',
                        null,
                        'Durability ',
                        React.createElement(
                            'span',
                            { className: 'durabilityBar' },
                            tooltip.durability + "/" + tooltip.durability
                        )
                    ),
                    React.createElement(
                        'p',
                        null,
                        "Bind on " + tooltip.bind
                    ),
                    React.createElement(
                        'p',
                        null,
                        skin1 + " and " + skin2
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'subTooltip2 col-sm-6' },
                    React.createElement(
                        'div',
                        { className: 'evolveInfo' },
                        refine.slice(0, -1)
                    )
                )
            );
        } else {
            return React.createElement('div', { className: 'itemTooltip' });
        }
    }
});

if (isNode) {
    exports.Evolver = Evolver;
} else {
    ReactDOM.render(React.createElement(Evolver, null), document.getElementById('evolver-wrap'));
}