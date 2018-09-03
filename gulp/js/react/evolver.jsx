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

var Evolver = React.createClass({
    getInitialState: function () {    
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
    componentDidMount: function() {
        var t = this;
        $.post('/evolver/data', {itemType: t.state.itemType}, function(data, status){
            t.state.tooltipCache.push(data[1]);
        
            t.setState({
                listData: data[0],
                selectedListEntry: data[0][0]._id,
                selectedListItemEntry: data[0][0].tree[0]._id,
                tooltipCache: t.state.tooltipCache
            });
        });
    },
    switchType: function(n, e) {
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
            $.post('/evolver/data', {itemType: type}, function(data, status){
                
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
    selectTree: function(id, i_id) {
        this.setState({
            selectedListEntry: id,
            selectedListItemEntry: i_id,
            stage: 1
        });
    },
    selectItem: function(tree_id, id, stage, e) {
        e.preventDefault();
        
        var tooltip = searchById(this.state.tooltipCache, id);
        var t = this;
        
        if (tooltip && id != this.state.selectedListItemEntry) {
            t.setState({
                selectedListEntry: tree_id,
                selectedListItemEntry: id,
                stage: stage
            });
        }
        else if (id != this.state.selectedListItemEntry) {
            $.post('/evolver/tooltipData', {id: id}, function(data, status) {
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
    selectStage: function(stage) {
        this.setState({
            stage: stage
        });
    },
    setItemClass: function(e) {
        this.setState({
            itemClass: e.target.value
        });
    },
    render: function () {
        var itemListData = null,
            itemTooltipData = null,
            suffix = "",
            imgType = "default";
        
        if (this.state.listData) {
            itemTooltipData = searchById(this.state.tooltipCache, this.state.selectedListItemEntry);
            
            var temp = searchById(this.state.listData, this.state.selectedListEntry);
            if (temp && temp.tree) {
                itemListData = searchById(temp.tree, this.state.selectedListItemEntry);
            }
            else {
                itemListData = temp;
            }
        }
            
        if (this.state.itemType == "weapon") {
            switch (this.state.itemClass) {
                case "BM" :
                    suffix = "Sword";
                    imgType = "sw";
                    break;
                case "KF" :
                    suffix = "Gauntlet";
                    imgType = "gt";
                    break;
                case "DE" :
                    suffix = "Axe";
                    imgType = "ta";
                    break;
                case "FM" :
                    suffix = "Bangle";
                    imgType = "ab";
                    break;
                case "AS" :
                    suffix = "Dagger";
                    imgType = "dg";
                    break;
                case "SU" :
                    suffix = "Staff";
                    imgType = "st";
                    break;
                case "BD" :
                    suffix = "Lyn Sword";
                    imgType = "sw";
                    break;
                case "WL" :
                    suffix = "Razor";
                    imgType = "dg";
                    break;
                case "SF" :
                    suffix = "Force Gauntlet";
                    imgType = "gt";
                    break;
            }
        }
            
        return (
            <div>
                <nav className="navbar navbar-inverse navbar-static-top itemNav">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <h1 className="subtitle">Item Evolver <small>Beta</small></h1>
                        </div>
                        <ul className="nav navbar-nav typeMenu">
                            <li className={(this.state.itemType == "weapon" ? " active" : "")}><a href="#" onClick={this.switchType.bind(null, 0)}><img width="20" src="/img/Inventory_Weapon.png" /> Weapon</a></li>
                            <li className={(this.state.itemType == "accessory" ? " active" : "")}><a href="#" onClick={this.switchType.bind(null, 1)}><img width="20" src="/img/Inventory_Acc.png"  /> Acessory</a></li>
                            <li className={(this.state.itemType == "misc" ? " active" : "")}><a href="#" onClick={this.switchType.bind(null, 2)}><img width="20" src="/img/Inventory_Etc.png"  /> Misc.</a></li>
                        </ul>
                    </div>
                </nav>
                <ItemList 
                    listData={this.state.listData}
                    selectedListEntry={this.state.selectedListEntry}
                    selectedListItemEntry={this.state.selectedListItemEntry}
                    suffix={suffix}
                    imgType={imgType}
                    itemClass={this.state.itemClass}
                    itemType={this.state.itemType}
                    
                    selectItem={this.selectItem}
                    selectTree={this.selectTree}
                    setItemClass={this.setItemClass}
                />
                <div className="tooltipTreeWrap col-lg-9">
                    <ItemTree
                        itemListData={itemListData}
                        itemTooltipData={itemTooltipData}
                        treeId={this.state.selectedListEntry}
                        imgType={imgType}
                        stage={this.state.stage}
                        
                        selectItem={this.selectItem}
                        selectStage={this.selectStage}
                    />
                    <ItemTooltip
                        listData={this.state.listData}
                        itemListData={itemListData}
                        itemTooltipData={itemTooltipData}
                        treeId={this.state.selectedListEntry}
                        suffix={suffix}
                        imgType={imgType}
                        itemType={this.state.itemType}
                        itemClass={this.state.itemClass}
                        stage={this.state.stage}
                        
                        selectItem={this.selectItem}
                    />
                </div>
            </div>
        );
    }
});


var ItemList = React.createClass({
    getInitialState: function () {
        return {
            filterInput: "",
            minLevel: 0,
            maxLevel: 45,
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
                filterSuperior : true,
                filterHeroic: true,
                filterLegendary: true
            });
        }
        else {
            this.setState({
                filterSuperior : false,
                filterHeroic: false,
                filterLegendary: false
            });
        }
    },
    gradeFilter: function(g) {
        switch (g) {
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
                            gradeCheck = (this.state.filterSuperior && treeItem.grade == 4) || (this.state.filterHeroic && treeItem.grade == 5) || (this.state.filterLegendary && treeItem.grade == 7);

                        if (inputCheck && levelCheck && gradeCheck) {
                            var itemSelected = this.props.selectedListItemEntry == treeItem._id,
                                image = this.props.itemType + "_" + this.props.imgType + "_" + treeItem.image[this.props.imgType] + "_" + treeItem.grade + "_1";

                            treeItems.push(
                                <li className={"itemListEntry subEntry" + (itemSelected ? " selected" : "")} onClick={this.props.selectItem.bind(null, entryData._id, treeItem._id, 1)}>
                                    <span className="thumb"><img src={"/img/" + this.props.itemType + "/" + image + ".png"} /></span>
                                    <span className={"name grade_" + treeItem.grade}>{itemName}</span>
                                </li>
                            );
                        }
                        else {
                            filtering = true;
                        }
                    }
                
                    treeItemsDiv = <div className="subEntryDiv">{treeItems}</div>;
                }
                
                if (!(treeItems.length == 0 && filtering)) {
                    treeEntries.push(
                        <div className="entryWraper">
                            <li className={"itemTreeEntry" + (treeSelected ? " selected" : "")} onClick={this.props.selectTree.bind(null, entryData._id, entryData.tree[0]._id)}>
                                <span className="thumb"><img src={"/img/" + this.props.itemType + "/" + treeImage + ".png"} /></span>
                                <span className="name">{entryData.name}</span>
                            </li>
                            {treeItemsDiv}
                        </div>
                    );
                }
            }
            else if (entryData.type == this.props.itemType){
                var treeItem = entryData,
                    itemName = treeItem.name + " " + this.props.suffix,
                    inputCheck = input == "" || itemName.toLowerCase().startsWith(input),
                    levelCheck = this.state.minLevel <= treeItem.level && this.state.maxLevel >= treeItem.level,
                    gradeCheck = (this.state.filterSuperior && treeItem.grade == 4) || (this.state.filterHeroic && treeItem.grade == 5) || (this.state.filterLegendary && treeItem.grade == 7);

                if (inputCheck && levelCheck && gradeCheck) {
                    var itemSelected = this.props.selectedListItemEntry == treeItem._id,
                        image = this.props.itemType + "_" + this.props.imgType + "_" + treeItem.image[this.props.imgType] + "_" + treeItem.grade + "_1";

                    itemEntries.push(
                        <li className={"itemListEntry subEntry" + (itemSelected ? " selected" : "")} onClick={this.props.selectItem.bind(null, entryData._id, treeItem._id, 1)}>
                            <span className="thumb"><img src={"/img/" + this.props.itemType + "/" + image + ".png"} /></span>
                            <span className={"name grade_" + treeItem.grade}>{itemName}</span>
                        </li>
                    );
                }
            }
        }
        
        var clear = null;
        if (this.state.filterInput != "") {
            clear = <span className="glyphicon glyphicon-remove" aria-hidden="true" onClick={this.clearFilter}></span>;
        }
        var allChecked = this.state.filterSuperior && this.state.filterHeroic && this.state.filterLegendary;
        
        var weaponFilter = null;
        if (this.props.itemType == "weapon") {
            weaponFilter = 
                <div className="form-group itemClassSelect">
                    <label>Class</label>
                    <select className="form-control" value={this.props.itemClass} onChange={this.props.setItemClass}>
                        <option value="BM">Blade Master</option>
                        <option value="KF">Kung Fu Master</option>
                        <option value="DE">Destroyer</option>
                        <option value="FM">Force Master</option>
                        <option value="AS">Assassin</option>
                        <option value="SU">Summoner</option>
                        <option value="BD">Blade Dancer</option>
                        <option value="WL">Warlock</option>
                        <option value="SF">Soul Fighter</option>
                    </select>
                </div>
        }
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
                                <label className="grade_4"><input type="checkbox" checked={this.state.filterSuperior} onChange={this.gradeFilter.bind(null, 4)} />Superior</label>
                            </div>
                            <div className="checkbox">
                                <label className="grade_5"><input type="checkbox" checked={this.state.filterHeroic} onChange={this.gradeFilter.bind(null, 5)} />Heroic</label>
                            </div>
                            <div className="checkbox">
                                <label className="grade_7"><input type="checkbox" checked={this.state.filterLegendary} onChange={this.gradeFilter.bind(null, 7)} />Legendary</label>
                            </div>
                        </div>
                        {weaponFilter}
                    </form>
                </div>
                <ItemListContent 
                    weaponList={this.props.itemType == "weapon"}
                    trees={treeEntries} 
                    items={itemEntries}
                />
            </div>
        );
    }
});

var ItemListContent = React.createClass({
    mixins: [ScrollLockMixin],
    componentDidMount: function () {
        this.scrollLock();
    },
    render: function() {
        return (
            <div className={"itemList col-lg-3" + (this.props.weaponList ? " weaponList" : "")} onScroll={this.preventScroll}>
                <dl className="itemGroup">
                    <dt><strong>Item Trees</strong></dt>
                    <dd>
                        {this.props.trees}
                    </dd>
                </dl>
                <dl className="itemGroup">
                    <dt><strong>Other Items</strong></dt>
                    <dd>
                        {this.props.items}
                    </dd>
                </dl>
                <li className="buffer"></li>
            </div>
        );
    }
});


var ItemTree = React.createClass({
    render: function() {
        var tooltip = this.props.itemTooltipData,
            list = this.props.itemListData;
        if (tooltip && tooltip.stats.length > 1) {
            var prev = null,
                next = null,
                treeEntries = [];
            
            if (tooltip.prev) {
                prev = 
                    <div className="prev" onClick={this.props.selectItem.bind(null, this.props.treeId, tooltip.prev, 10)}>
                        <span className="glyphicon glyphicon-menu-left" aria-hidden="true"></span>
                    </div>;
            }
            
            if (tooltip.next) {
                next = 
                    <div className="next" onClick={this.props.selectItem.bind(null, this.props.treeId, tooltip.next, 1)}>
                        <span className="glyphicon glyphicon-menu-right" aria-hidden="true"></span>
                    </div>;
            }
            
            for (var t = 1; t <= tooltip.stats.length; t++) {
                treeEntries.push(
                    <span className={"treeEntry" + (t == this.props.stage ? " selected" : "")} onClick={this.props.selectStage.bind(null, t)}>
                        <img src={"/img/item-overlay" + (t == 10 ? t + "max" : t) + ".png"} />
                    </span>
                );
            
                treeEntries.push(
                    <span className={"treeLine" + (t < this.props.stage ? " filled" : "")}></span>
                );
            }
            
            return (
                <div className="itemTree">
                    {prev}
                    <div className="tree">
                        {treeEntries.slice(0, -1)}
                    </div>
                    {next}
                </div>
            );
        }
        else {
            return (
                <div></div>
            );
        }
    }
});

var ItemTooltip = React.createClass({
    refineDiv: function(refineData, type) {
        if (type == "Breakthrough" || type == "Transform") {
            var tempData = searchById(this.props.listData, refineData.amplifier),
                ingredients = [],
                cost = [];

            for (var i in refineData.ingredients) {
                var ing = refineData.ingredients[i];

                ingredients.push(
                    <p className="ingredient">
                        <img height="30" width="30" src={"/img/misc/" + ing.image + ".png"} />
                        <span className={"grade_" + ing.grade}>{ing.item}</span> <span>{"x" + ing.amount}</span>
                    </p>
                );
            }

            if (refineData.cost[0] > 0) {
                cost.push(
                    <span>{refineData.cost[0]}<img height="20" width="20" src="/img/money_gold.png" /></span>
                );
            }

            if (refineData.cost[1] > 0) {
                cost.push(
                    <span>{refineData.cost[1]}<img height="20" width="20" src="/img/money_silver.png" /></span>
                );
            }

            if (refineData.cost[2] > 0) {
                cost.push(
                    <span>{refineData.cost[2]}<img height="20" width="20" src="/img/money_copper.png" /></span>
                );
            }

            var at = null;
            if (type == "Breakthrough") {
                at = <small>At Stage 5 <img height="20" width="20" src="/img/item-overlay5max.png" /></small>;
            }
            else {
                var tempData2 = searchById(searchById(this.props.listData, this.props.treeId).tree, refineData.to);

                at = <small>At Stage 10 <img height="20" width="20" src="/img/item-overlay10max.png" /> to <img height="20" width="20" src={"/img/" + this.props.itemType + "/" + this.props.itemType + "_" + this.props.imgType + "_" + tempData2.image[this.props.imgType] + "_" + tempData2.grade + "_1.png"} /> <a href="#" className={"grade_" + tempData2.grade} onClick={this.props.selectItem.bind(null, this.props.treeId, tempData2._id, 1)}>{tempData2.name + " " + this.props.suffix + " - Stage 1"}</a></small>;
            }
            
            return( 
                <div className="refineDiv">
                    <h4>{type} {at}</h4>
                    <div className="refine">
                        <h5>Amplifier</h5>
                        <div className="amplifier">
                            <img height="45" width="45" src={"/img/" + this.props.itemType + "/" + this.props.itemType + "_" + this.props.imgType + "_" + tempData.image[this.props.imgType] + "_" + tempData.grade + "_1.png"} />
                            <a href="#" className={"grade_" + tempData.grade} onClick={this.props.selectItem.bind(null, refineData.amplifier, tempData._id, 1)}>{tempData.name + " " + this.props.suffix}</a>
                        </div>
                        <h5>Ingredients</h5>
                        <div className="ingredientList">
                            {ingredients}
                        </div>
                        <h5>Base Cost</h5>
                        <div className="cost">
                            {cost}
                        </div>
                    </div>
                </div>
            );
        }
        else {
            var refineLv = null,
                breakthrough = null,
                transform = null;
            
            if (refineData.breakthrough) {                
                var tempData = searchById(searchById(this.props.listData, refineData.breakthrough[0]).tree, refineData.breakthrough[1]);
                
                breakthrough =
                    <div className="amplifier noindent">
                        <img height="20" width="20" src={"/img/tooltip_breakmaterial.png"} />
                        <span>Breakthrough amplifier for </span>
                        <img height="20" width="20" src={"/img/" + this.props.itemType + "/" + this.props.itemType + "_" + this.props.imgType + "_" + tempData.image[this.props.imgType] + "_" + tempData.grade + "_1.png"} />
                        <a href="#" className={"grade_" + tempData.grade} onClick={this.props.selectItem.bind(null, refineData.breakthrough[0], tempData._id, 1)}>{tempData.name + " " + this.props.suffix}</a>
                    </div>;
            }
            
            if (refineData.transform) {                
                var treeData = searchById(this.props.listData, refineData.transform[0]).tree,
                    withData = searchById(treeData, refineData.transform[1]),
                    toData = searchById(treeData, refineData.transform[2]);
                
                transform =
                    <div className="amplifier noindent">
                        <img height="20" width="20" src={"/img/tooltip_growth.png"} />
                        <span>Transform amplifier for </span>
                        <img height="20" width="20" src={"/img/" + this.props.itemType + "/" + this.props.itemType + "_" + this.props.imgType + "_" + withData.image[this.props.imgType] + "_" + withData.grade + "_1.png"} />
                        <a href="#" className={"grade_" + withData.grade} onClick={this.props.selectItem.bind(null, refineData.transform[0], withData._id, 1)}>{withData.name + " " + this.props.suffix}</a>
                        <span> to </span>
                        <img height="20" width="20" src={"/img/" + this.props.itemType + "/" + this.props.itemType + "_" + this.props.imgType + "_" + toData.image[this.props.imgType] + "_" + toData.grade + "_1.png"} />
                        <a href="#" className={"grade_" + toData.grade} onClick={this.props.selectItem.bind(null, refineData.transform[0], toData._id, 1)}>{toData.name + " " + this.props.suffix}</a>
                    </div>;
            }
            
            if (refineData.lv) {
                refineLv =
                    <div className="amplifier noindent">
                        <img height="20" width="20" src={"/img/tooltip_growthexp.png"} />
                        <span>{"Refinement amplifier for level " + refineData.lv[0] + "~" + refineData.lv[1] + " weapons"}</span>
                    </div>;
            }
            else {
                refineLv =
                    <div className="amplifier noindent">
                        <img height="20" width="20" src={"/img/tooltip_warning.png"} />
                        <span>Cannot be used as refinement amplifier</span>
                    </div>;
            }
        
            return( 
                <div className="refineDiv">
                    <h4>{type}</h4>
                    <div className="refine">
                        {breakthrough}
                        {transform}
                        {refineLv}
                    </div>
                </div>
            );
        }
    },
    render: function() {
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
                imgStage = <img className="stageOverlay" src={"/img/item-overlay" + (this.props.stage == 10 ? this.props.stage + "max" : this.props.stage) + ".png"} />;
            }
            
            main = <p className="m">{"Attack " + stats.mValue}</p>;
            
            for (var s in stats.sub) {
                sub.push(
                    <p className="s">{stats.sub[s].type + " " + stats.sub[s].value}</p>
                );
            }
            
            for (var e in stats.effects) {
                extra.push(
                    <p className="e">{stats.effects[e].text}</p>
                );
            }
            
            for (var a in tooltip.acquire) {
                if (tooltip.acquire[a].evolve) {
                    var i = [];
                    
                    for (var v in tooltip.acquire[a].evolve) {
                        if (tooltip.acquire[a].evolve[v].tree) {
                            var tempData = searchById(searchById(itemList, tooltip.acquire[a].evolve[v].tree).tree, tooltip.acquire[a].evolve[v].tree);
                            
                            i.push(
                                <span>
                                    <img height="20" width="20" src={"/img/" + this.props.itemType + "/" + this.props.itemType + "_" + this.props.imgType + "_" + tempData.image[this.props.imgType] + "_" + tempData.grade + "_1.png"} />
                                    <a href="#" className={"grade_" + tempData.grade} onClick={this.props.selectItem.bind(null, tooltip.acquire[a].evolve[v].tree, tempData._id, tooltip.acquire[a].evolve[v].stage)}>{tempData.name + " " + this.props.suffix + " - Stage " +  tooltip.acquire[a].evolve[v].stage}</a>
                                </span>
                            );
                            
                            i.push(<span> + </span>);
                        }
                        else {
                            var tempData = searchById(itemList, tooltip.acquire[a].evolve[v].id);
                        
                            i.push(
                                <span>
                                    <img height="20" width="20" src={"/img/" + this.props.itemType + "/" + this.props.itemType + "_" + this.props.imgType + "_" + tempData.image[this.props.imgType] + "_" + tempData.grade + "_1.png"} />
                                    <a href="#" className={"grade_" + tempData.grade} onClick={this.props.selectItem.bind(null, tooltip.acquire[a].evolve[v].id, tempData._id, 1)}>{tempData.name + " " + this.props.suffix}</a>
                                </span>
                            );
                            
                            i.push(<span> + </span>);
                        }
                    }                    
                    
                    acquireList.push(
                        <p className="acquireInfo">
                            <img height="20" width="20" className="cond-icon" src={"/img/" + tooltip.acquire[a].image + ".png"} alt="acq-icon"></img>
                            {i.slice(0, -1)}
                        </p>
                    );
                }
                else {
                    acquireList.push(
                        <p className="acquireInfo">
                            <img height="20" width="20" className="cond-icon" src={"/img/" + tooltip.acquire[a].image + ".png"} alt="acq-icon"></img>
                            <span className={tooltip.acquire[a].type}>{tooltip.acquire[a].location}</span>
                        </p>
                    );
                }
            }
            
            for (var g = 0; g < tooltip.initialSlots; g++) {
                gem.push(
                    <img className="slot" src="/img/gemslot_0_normal.png" />
                );
            }
        
            switch (this.props.itemClass) {
                case "BM" :
                    classLimit = <p>Blade Master only</p>
                    break;
                case "KF" :
                    classLimit = <p>Kung Fu Master only</p>
                    break;
                case "DE" :
                    classLimit = <p>Destroyer Master only</p>
                    break;
                case "FM" :
                    classLimit = <p>Force Master only</p>
                    break;
                case "AS" :
                    classLimit = <p>Assassin only</p>
                    break;
                case "SU" :
                    classLimit = <p>Summoner only</p>
                    break;
                case "BD" :
                    classLimit = <p>Blade Dancer only</p>
                    break;
                case "WL" :
                    classLimit = <p>Warlock only</p>
                    break;
                case "SF" :
                    classLimit = <p>Soul Fighter only</p>
                    break;
            }
        
            var skin1 = tooltip.skin[0] ? "Can be skinned" : "Cannot be skinned",
                skin2 = tooltip.skin[1] ? "can be used as a skin" : "cannot be used as a skin";
        
            var refine = [];
            if (tooltip.breakthrough) {
                refine.push(this.refineDiv(tooltip.breakthrough, "Breakthrough"));
                refine.push(<hr />);
            }
        
            if (tooltip.transform) {
                refine.push(this.refineDiv(tooltip.transform, "Transform"));
                refine.push(<hr />);
            }
            
            if (tooltip.amplifier) {
                refine.push(this.refineDiv(tooltip.amplifier, "Amplifier"));
                refine.push(<hr />);
            }

            return (
                <div className="itemTooltip">
                    <div className="subTooltip1 col-sm-6">
                        <h3 className={"name grade_" + list.grade}>{list.name + " " + this.props.suffix + stage}</h3>
                        <span className="thumb">
                            {imgStage}
                            <img src={"/img/" + this.props.itemType + "/" + image + ".png"} />
                        </span>
                        <span className="stats">
                            {main}
                            {sub}
                        </span>
                        <div className="effects">
                            {extra}
                        </div>
                        <div className="gemDiv">
                            {gem}
                            <p>{"Maximum Gem Slots: " + tooltip.maxSlots}</p>
                            {gemExtra}
                        </div>
                        <div className="acquireDiv">
                            <span>Acquired from</span>
                            {acquireList}
                        </div>
                        {flavor}
                        <p>{"Requires level " + list.level}</p>
                        {classLimit}
                        <p>Durability <span className="durabilityBar">{tooltip.durability + "/" + tooltip.durability}</span></p>
                        <p>{"Bind on " + tooltip.bind}</p>
                        <p>{skin1 + " and " + skin2}</p>
                    </div>
                    <div className="subTooltip2 col-sm-6">
                        <div className="evolveInfo">
                            {refine.slice(0, -1)}
                        </div>
                    </div>
                </div>
            )
        }
        else {
            return (
                <div className="itemTooltip"></div>
            );
        }
    }
});


if (isNode) {
    exports.Evolver = Evolver
} else {
    ReactDOM.render(
        <Evolver />,
        document.getElementById('evolver-wrap')
    );
}