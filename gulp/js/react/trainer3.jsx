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
    
function search(arr, id) {
    var index = arr.map(function(x) {return x._id; }).indexOf(id);
    return arr[index];
}

function searchPos(arr, id) {
    var index = arr.map(function(x) {return x.position; }).indexOf(id);
    return arr[index];
}

function generateCode (lv, hLv, treeData, version) {
    var code = "";
    lv = ("0" + lv).slice(-2);
    hLv = ("0" + hLv).slice(-2);

    code += lv + hLv + version;
    for (var index in treeData) {
        if (treeData[index].status != "0") {
            code += treeData[index]._id.slice(2) + treeData[index].status;
        }
    }
    return code;
}

function generateList(base, c, name, lv, hLv, treeData, version) {
    var b = JSON.parse(base);
    b[c] = {
        "name": name,
        "code": generateCode(lv, hLv, treeData, version)
    };
    return JSON.stringify(b);
}

function getTotalPoints(lv, hlv) {
    var extra = (6 * hlv - Math.pow(-1, hlv) + 13) / 4,
        normal = lv - 14;
    if (normal < 0) {
        normal = 0;
    }
    if (hlv == 0) {
        extra = 0;
    }
    return extra + normal;
}

function getParents(node, tree, points) {
    var learned = [node.position];
    if (node.parent == null) {
        return [learned, points + node.points];
    }
    var result = getParents(searchPos(tree.nodes, node.parent), tree, points);
    learned = learned.concat(result[0]);
    points += result[1];
    return [learned, points + node.points];
}

function applyCode(skillcode, treeData) {
    var totalUsedPoints = 0;
    for (var skillId in skillcode) {
        var skill = search(treeData, skillId);
        if (skill) {
            var position = skillcode[skillId],
                node = searchPos(skill.nodes, position);
            if (node) {
                skill.status = position;
                var result = getParents(node, skill, 0);
                skill.learned = result[0];
                skill.usedPoints = result[1];
                totalUsedPoints += result[1];
            }
        }
    }
    return [treeData, totalUsedPoints];
}

function parseCode(code, version) {
    var j, 
        lv, 
        hlv, 
        ver,
        skillcode,
        start,
        end,
        skillPair = "",
        skillArray = {}, 
        versionStatus = 0;
        
    if (!isNaN(code.slice(0, 2))) {
        j = job;
        lv = code.slice(0, 2);
        hlv = code.slice(2, 4);
        ver = code.slice(4, 7);
        skillcode = code.slice(7);
        start = 0;
        end = 5;
        
        var prefix;
        
        switch (job) {
            case 'BM':
                prefix = "20";
                break;
            case 'KF':
                prefix = "21";
                break;
            case 'FM':
                prefix = "22";
                break;
            case 'DE':
                prefix = "24";
                break;
            case 'AS':
                prefix = "25";
                break;
            case 'SU':
                prefix = "26";
                break;
            case 'BD':
                prefix = "27";
                break;
            case 'WL':
                prefix = "28";
                break;
            case 'SF':
                prefix = "30";
                break;
        }
        
        if (ver.slice(0, 2) == version.slice(0, 2)) {
            if (ver.slice(2, 3) != version.slice(2, 3)) {
                versionStatus = 1;
            }
            while (start < skillcode.length) {
                skillPair = skillcode.slice(start, end);

                skillArray[prefix + skillPair.slice(0,3)] = skillPair.slice(3);

                start += 5;
                end += 5;
            }
        }
        else {
            versionStatus = 2;
        }
    }
    else {
        j = code.slice(0, 2);
        lv = code.slice(2, 4);
        hlv = code.slice(4, 6);
        ver = code.slice(6, 9);
        skillcode = code.slice(9);
        start = 0;
        end = 7;

        if (ver.slice(0, 2) == version.slice(0, 2)) {
            if (ver.slice(2, 3) != version.slice(2, 3)) {
                versionStatus = 1;
            }
            while (start < skillcode.length) {
                skillPair = skillcode.slice(start, end);

                skillArray[skillPair.slice(0,5)] = skillPair.slice(5);

                start += 7;
                end += 7;
            }
        }
        else {
            versionStatus = 2;
        }
    }
    return [j, parseInt(lv), parseInt(hlv), skillArray, versionStatus];
}

function getChildren (node, tree) {
    var result = [node.position];
    if (node.children == null) {
        return node.position;
    }
    for (var n in node.children) {
        result = result.concat(getChildren(searchPos(tree.nodes, node.children[n]), tree));
    }
    return result;
}

function sortTags (tags) {
    var order = ["Joint Attack", "Status Effect Resistance", "Damage Resistance", "Projectile Resistance", "Defense Penetration", "Deflect Penetration", "Defense Break", "Block", "Counter", "Deflect", "Stun", "Daze", "Knockback", "Knockdown", "Knockup", "Unconscious", "Slow", "Freeze", "Snare", "Deep Freeze", "Frost Prison", "Pull", "Grab", "Phantom Grip", "Grapple", "Deep Wound", "Bleed", "Deadly Poison", "Chill", "Offensive-Defense Disable", "Defense Disable", "Charge Disable", "Survivability", "Speed Increase", "Threat Increase", "Taunt", "Party Buff", "Time Distortion", "Soulburn", "Amplification", "Restrain", "Shroud", "Party Protection", "Ice Protection", "Blade Protection", "Stealth Protection", "Awakened", "Restricted", "Projectile", "Offensive-Defense", "Defense", "Charge", "Movement", "Escape", "Windwalk", "Familiar", "Passive"];
    
    var result = tags.sort(function(a, b) {
        return order.indexOf(a) - order.indexOf(b);
    });
    
    return result;
}

var Trainer = React.createClass({
    getInitialState: function () {
        var lv = 50,
            hlv = 1;
            
        return {
            listData: null,
            treeData: null,
            tooltipData: null,
            currentSkillId: null,
            currentSubSkillId: null,
            currentTreeId: null,
            level: lv,
            hLevel: hlv,
            atk: 13,
            wpnCnst: 1,
            addDmg: 0,
            availablePoints: getTotalPoints(lv, hlv),
            totalUsedPoints: 0,
            mode: 0,
            tempTooltip: null,
            versionStatus: null,
            fireDmg: "100.00",
            iceDmg: "100.00",
            lightningDmg: "100.00",
            voidDmg: "100.00",
            windDmg: "100.00",
            earthDmg: "100.00",
            buildList: [
                {
                    "name": "Build1",
                    "treeData": null,
                    "usedPoints": 0
                }
            ],
            currentBuild: 0,
            currentBuildName: "Build1",
            testMode: false
        };
    },
    componentDidMount: function() {
        var unparsedData = '',
            parsedData = [],
            version = "",
            list_data = null,
            tree_data = null,
            tooltip_data = null,
            lv = 50,
            hlv = 1,
            usedPoints = 0,
            versionStatus = 0,
            t = this,
            buildName = "Build1";
        
        if (typeof buildCode != 'undefined') {
            unparsedData = buildCode;
        }
        if (typeof buildList != 'undefined' && buildList.trim() != "") {
            unparsedData = JSON.parse(buildList);
        }
        $.post('/' + job + '/data', {}, function(data, status){
            version = data.version;
            list_data = data.SkillList;
            tree_data = data.SkillTrees;
            tooltip_data = data.SkillTooltips;
            
            var builds = [
                {
                    "name": "Build1",
                    "treeData": JSON.parse(JSON.stringify(data.SkillTrees)),
                    "usedPoints": 0
                }
            ];
            
            var initial = list_data[0]._id;
            
            if (unparsedData != '') {
                builds = [];
                var codeResult = null;
                if (Array.isArray(unparsedData)){
                    for (var i in unparsedData) {
                        if (unparsedData[i]) {
                            parsedData = parseCode(unparsedData[i].code, version);
                            if (job == parsedData[0]) {
                                codeResult = applyCode(parsedData[3], JSON.parse(JSON.stringify(tree_data)));
                                var lv2,
                                    hlv2;
                                
                                if (parsedData[1] > 0 && parsedData[1] < 51) { 
                                    lv2 = parsedData[1];
                                }
                                if (parsedData[1] >= 45 && parsedData[1] <= 50 && parsedData[2] > -1 && parsedData[2] < 21) {
                                    hlv2 = parsedData[2];
                                }
                                else if (parsedData[1] < 45) {
                                    hlv2 = 0;
                                }
                                
                                builds.push({
                                    "name" : unparsedData[i].name,
                                    "lv": lv2,
                                    "hlv": hlv2,
                                    "treeData": codeResult[0],
                                    "usedPoints": codeResult[1]
                                });

                                if (i == 0) {
                                    if (parsedData[1] > 0 && parsedData[1] < 51) { 
                                        lv = parsedData[1];
                                    }
                                    if (parsedData[1] >= 45 && parsedData[1] <= 50 && parsedData[2] > -1 && parsedData[2] < 21) {
                                        hlv = parsedData[2];
                                    }
                                    else if (parsedData[1] < 45) {
                                        hlv = 0;
                                    }
                                    versionStatus = parsedData[4];
                                }
                            }
                        }
                    }
                    
                    tree_data = JSON.parse(JSON.stringify(builds[0].treeData));
                    usedPoints = builds[0].usedPoints;
                    buildName = builds[0].name;
                }
                else {
                    buildList = "[null, null, null, null, null]";
                
                    parsedData = parseCode(unparsedData, version);
                    if (job == parsedData[0]) {
                        if (parsedData[1] > 0 && parsedData[1] < 51) { 
                            lv = parsedData[1];
                        }
                        if (parsedData[1] >= 45 && parsedData[1] <= 50 && parsedData[2] > -1 && parsedData[2] < 21) {
                            hlv = parsedData[2];
                        }
                        else if (parsedData[1] < 45) {
                            hlv = 0;
                        }
                        codeResult = applyCode(parsedData[3], tree_data);
                        builds.push({
                            "name": "Build1",
                            "lv": lv,
                            "hlv": hlv,
                            "treeData": JSON.parse(JSON.stringify(codeResult[0])),
                            "usedPoints": codeResult[1]
                        });
                        
                        tree_data = codeResult[0];
                        usedPoints = codeResult[1];
                        versionStatus = parsedData[4];
                    }
                }
            }
            
            for (var d in tooltip_data) {
                var allTags = [];
                for (var n in tooltip_data[d].nodes) {
                    if (tooltip_data[d].nodes[n].tags) {
                        for (var v in tooltip_data[d].nodes[n].tags) {
                            if (allTags.indexOf(tooltip_data[d].nodes[n].tags[v]) == -1) {
                                allTags.push(tooltip_data[d].nodes[n].tags[v]);
                            }
                        }
                    }
                }
                
                var l = search(list_data, tooltip_data[d]._id);
                if (l) {
                    l.allTags = sortTags(allTags);
                }
            }
            
            var view = 0;
            if (typeof viewMode != 'undefined') {
                view = viewMode;
            }
            t.setState({
                listData: list_data,
                treeData: tree_data,
                tooltipData: tooltip_data,
                currentSkillId: list_data[0]._id,
                currentTreeId: list_data[0].treeId,
                level: lv,
                hLevel: hlv,
                atk: 13,
                wpnCnst: 1,
                addDmg: 0,
                mode: view,
                version: version,
                availablePoints: getTotalPoints(lv, hlv),
                totalUsedPoints: usedPoints,
                tempTooltip: null,
                versionStatus: versionStatus,
                buildList: builds,
                currentBuild: 0,
                currentBuildName: buildName
            });
            
            buildCode = generateCode(t.state.level, t.state.hLevel, t.state.treeData, t.state.version);
            
            if (edit){
                buildList = generateList(buildList, t.state.currentBuild, t.state.currentBuildName, t.state.level, t.state.hLevel, t.state.treeData, t.state.version);
            }
        });
    },
    toggleTest: function() {
        var t = this;
        
        if (this.state.testMode) {
            $.post('/' + job + '/data', {}, function(data, status) {
                var list_data = data.SkillList,
                    tree_data = data.SkillTrees,
                    tooltip_data = data.SkillTooltips;
                    
                for (var d in tooltip_data) {
                    var allTags = [];
                    for (var n in tooltip_data[d].nodes) {
                        if (tooltip_data[d].nodes[n].tags) {
                            for (var v in tooltip_data[d].nodes[n].tags) {
                                if (allTags.indexOf(tooltip_data[d].nodes[n].tags[v]) == -1) {
                                    allTags.push(tooltip_data[d].nodes[n].tags[v]);
                                }
                            }
                        }
                    }

                    var l = search(list_data, tooltip_data[d]._id);
                    if (l) {
                        l.allTags = sortTags(allTags);
                    }
                }

                t.setState({
                    listData: list_data,
                    treeData: tree_data,
                    tooltipData: tooltip_data,
                    testMode: !t.state.testMode
                });
            });
        }
        else {
            $.post('/' + job + '/dataKR', {}, function(data, status) {
                var list_data = data.SkillList,
                    tree_data = data.SkillTrees,
                    tooltip_data = data.SkillTooltips;
                    
                for (var d in tooltip_data) {
                    var allTags = [];
                    for (var n in tooltip_data[d].nodes) {
                        if (tooltip_data[d].nodes[n].tags) {
                            for (var v in tooltip_data[d].nodes[n].tags) {
                                if (allTags.indexOf(tooltip_data[d].nodes[n].tags[v]) == -1) {
                                    allTags.push(tooltip_data[d].nodes[n].tags[v]);
                                }
                            }
                        }
                    }

                    var l = search(list_data, tooltip_data[d]._id);
                    if (l) {
                        l.allTags = sortTags(allTags);
                    }
                }
                    
                t.setState({
                    listData: list_data,
                    treeData: tree_data,
                    tooltipData: tooltip_data,
                    testMode: !t.state.testMode
                });
            });
        }
        
    },
    handleNavLevel: function (e) {
        var level = e.target.value,
            points = 0,
            hlv = this.state.hLevel;
        if (level < 50) {
            points = getTotalPoints(level, 0);
            this.setState({
                level: level,
                availablePoints: points,
                hLevel: 0
            });
            
            hlv = 0;
        }
        else if (hlv < 1) {
            points = getTotalPoints(level, 1);
            this.setState({
                level: level,
                hLevel: 1,
                availablePoints: points
            });
            
            hlv = 1;
        }
        else {
            points = getTotalPoints(level, hlv);
            this.setState({
                level: level,
                availablePoints: points
            });
        }
        
        var t = this.state.totalUsedPoints;
        if (points < this.state.totalUsedPoints) {
            for (var s in this.state.treeData) {
                this.state.treeData[s].status = "0";
                this.state.treeData[s].learned = [];
                this.state.treeData[s].usedPoints = 0;
            }
            t = 0;
            this.setState({
                treeData: this.state.treeData,
                totalUsedPoints: 0
            });
        }
        
        this.state.buildList[this.state.currentBuild].lv = level;
        this.state.buildList[this.state.currentBuild].hlv = hlv;
        this.state.buildList[this.state.currentBuild].usedPoints = t;
        this.state.buildList[this.state.currentBuild].treeData = JSON.parse(JSON.stringify(this.state.treeData));
        
        this.setState({
            buildList: this.state.buildList
        });
        
        buildCode = generateCode(this.state.level, this.state.hLevel, this.state.treeData, this.state.version);
            
        if (edit){
            buildList = generateList(buildList, this.state.currentBuild, this.state.currentBuildName, this.state.level, this.state.hLevel, this.state.treeData, this.state.version);
        }
    },
    handleNavHLevel: function(e) {
        var hLevel = e.target.value;
        
        if (this.state.level == 50 && hLevel < 1) {
            hLevel = 1;
        }
        
        var points = getTotalPoints(this.state.level, hLevel);
        
        this.setState({
            hLevel: hLevel,
            availablePoints: points
        });
        
        var t = this.state.totalUsedPoints;
        if (points < this.state.totalUsedPoints) {
            for (var s in this.state.treeData) {
                this.state.treeData[s].status = "0";
                this.state.treeData[s].learned = [];
                this.state.treeData[s].usedPoints = 0;
            }
            t = 0;
            this.setState({
                treeData: this.state.treeData,
                totalUsedPoints: 0
            });
        }
        
        this.state.buildList[this.state.currentBuild].lv = this.state.level;
        this.state.buildList[this.state.currentBuild].hlv = hLevel;
        this.state.buildList[this.state.currentBuild].usedPoints = t;
        this.state.buildList[this.state.currentBuild].treeData = JSON.parse(JSON.stringify(this.state.treeData));
        
        this.setState({
            buildList: this.state.buildList
        });
        
        buildCode = generateCode(this.state.level, this.state.hLevel, this.state.treeData, this.state.version);
            
        if (edit){
            buildList = generateList(buildList, this.state.currentBuild, this.state.currentBuildName, this.state.level, this.state.hLevel, this.state.treeData, this.state.version);
        }
    },
    handleNavAtk: function(e) {
        var atk = parseInt(e.target.value, 10);
        if (!isNaN(atk) && atk >= 0){
            if (atk > 999) {
                atk = 999;
            }
            this.setState({
                atk: atk
            });
        }
        else {
            this.setState({
                atk: ""
            });
        }
    },
    handleNavWpnCnst: function(e) {
        var wpnCnst = parseInt(e.target.value, 10);
        if (!isNaN(wpnCnst) && wpnCnst > 0){
            if (wpnCnst > 99) {
                wpnCnst = 99;
            }
            this.setState({
                wpnCnst: wpnCnst
            });
        }
        else {
            this.setState({
                wpnCnst: ""
            });
        }
    },
    handleNavAddDmg: function(e) {
        var add = parseInt(e.target.value, 10);
        if (!isNaN(add) && add >= 0){
            if (add > 999) {
                add = 999;
            }
            this.setState({
                addDmg: add
            });
        }
        else {
            this.setState({
                addDmg: ""
            });
        }
    },
    handleNavElemDmg: function(elem, value) {
        if (!isNaN(value) && value >= 0) {
            switch (elem) {
                case 'fire':
                    this.setState({
                        fireDmg: value
                    });
                    break;
                case 'ice':
                    this.setState({
                        iceDmg: value
                    });
                    break;
                case 'lightning':
                    this.setState({
                        lightningDmg: value
                    });
                    break;
                case 'void':
                    this.setState({
                        voidDmg: value
                    });
                    break;
                case 'wind':
                    this.setState({
                        windDmg: value
                    });
                    break;
                case 'earth':
                    this.setState({
                        earthDmg: value
                    });
                    break;
            }
        }
    },
    handleResetAll: function() {
        var tree = this.state.treeData;
        for (var s in this.state.treeData){
            tree[s].learned = [];
            tree[s].status = "0";
            tree[s].usedPoints = 0;
        }
        
        this.state.buildList[this.state.currentBuild].treeData = JSON.parse(JSON.stringify(this.state.treeData));
        this.state.buildList[this.state.currentBuild].usedPoints = 0;
        
        this.setState({
            treeData: this.state.treeData,
            totalUsedPoints: 0,
            buildList: this.state.buildList
        });
        
        buildCode = generateCode(this.state.level, this.state.hLevel, this.state.treeData, this.state.version);
        
        if (edit){
            buildList = generateList(buildList, this.state.currentBuild, this.state.currentBuildName, this.state.level, this.state.hLevel, this.state.treeData, this.state.version);
        }
    },
    handleListClick: function(skillId, treeId) {
        this.setState({
            currentSkillId: skillId,
            currentTreeId: treeId,
            currentSubSkillId: null
        });
        if (this.state.mode == 1) {
            $('#gridModal').modal('show');
        }
    },
    handleSubListClick: function(subId) {
        this.setState({
            currentSubSkillId: subId
        });
    },
    handleTreeLearn: function(pos, points) {
        var currentTree = search(this.state.treeData, this.state.currentTreeId),
            beforeP = currentTree.usedPoints;
        currentTree.learned = pos;
        currentTree.status = pos[0];
        currentTree.usedPoints = points;
        
        this.state.buildList[this.state.currentBuild].treeData = JSON.parse(JSON.stringify(this.state.treeData));
        this.state.buildList[this.state.currentBuild].usedPoints = this.state.totalUsedPoints - beforeP + points;
        
        if (this.state.currentSubSkillId) {
            var ar = search(this.state.listData, this.state.currentSkillId).subEntry,
                sub = ar[ar.map(function(x) {return x.id; }).indexOf(this.state.currentSubSkillId)];
                
            if ((sub.disableFlag && pos.indexOf(sub.disableFlag) == -1) || (sub.revDisableFlag && pos.indexOf(sub.revDisableFlag) != -1)) {
                this.setState({
                    currentSubSkillId: null
                });
            }
        }
        
        this.setState({
            treeData: this.state.treeData,
            totalUsedPoints: this.state.buildList[this.state.currentBuild].usedPoints,
            buildList: this.state.buildList
        });
        
        buildCode = generateCode(this.state.level, this.state.hLevel, this.state.treeData, this.state.version);
            
        if (edit){
            buildList = generateList(buildList, this.state.currentBuild, this.state.currentBuildName, this.state.level, this.state.hLevel, this.state.treeData, this.state.version);
        }
    },
    handleTreeUnlearn: function(pos, points, parent) {
        var currentTree = search(this.state.treeData, this.state.currentTreeId),
            index = currentTree.learned.indexOf(pos),
            noChildLearned = true,
            childrenArray = searchPos(currentTree.nodes, pos).children;
        
        currentTree.learned.splice(index, 1);
        
        for (var c in childrenArray) {
            var childNodePos = childrenArray[c];
            if (currentTree.learned.indexOf(childNodePos) != -1) {
                var childNode = searchPos(currentTree.nodes, childNodePos);
                this.handleTreeUnlearn(childNode.position, childNode.points + points, parent);
                noChildLearned = false;
            }
        }
        
        if (this.state.currentSubSkillId) {
            var ar = search(this.state.listData, this.state.currentSkillId).subEntry,
                sub = ar[ar.map(function(x) {return x.id; }).indexOf(this.state.currentSubSkillId)];
            
            if ((sub.disableFlag && pos.indexOf(sub.disableFlag) == -1) || (sub.revDisableFlag && pos.indexOf(sub.revDisableFlag) == 1)) {
                this.setState({
                    currentSubSkillId: null
                });
            }
        }

        if (childrenArray == null || noChildLearned) {
            if (parent) {
                currentTree.status = parent;
            }
            else {
                currentTree.status = "0";
            }
            currentTree.usedPoints = currentTree.usedPoints - points;
            
            this.state.buildList[this.state.currentBuild].treeData = JSON.parse(JSON.stringify(this.state.treeData));
            this.state.buildList[this.state.currentBuild].usedPoints = this.state.totalUsedPoints - points;
            
            this.setState({
                treeData: this.state.treeData,
                totalUsedPoints: this.state.totalUsedPoints - points,
                buildList: this.state.buildList
            });
        }
        
        buildCode = generateCode(this.state.level, this.state.hLevel, this.state.treeData, this.state.version);
            
        if (edit){
            buildList = generateList(buildList, this.state.currentBuild, this.state.currentBuildName, this.state.level, this.state.hLevel, this.state.treeData, this.state.version);
        }
    },
    handleTreeHover: function (tempPos) {
        this.setState({
            tempTooltip: tempPos
        });
    },
    handleTreeExit: function() {
        this.setState({
            tempTooltip: null
        });
    },
    handleMode: function(m, event) {
        event.preventDefault();
        if (this.state.currentSubSkillId != null) {
            this.setState({
                currentSubSkillId: null
            });
        }
        this.setState({
            mode: m
        });
        
        $.post('/mode', {mode: m}, function(data, status){
            
        });
    },
    addBuild: function(e) {
        e.preventDefault();
        
        var tree = this.state.treeData;
        for (var s in this.state.treeData){
            tree[s].learned = [];
            tree[s].status = "0";
            tree[s].usedPoints = 0;
        }
        var l = this.state.buildList.length,
            l2 = l + 1;
        if (l < 10) {
            var name = "Build" + l2;
            var n = this.state.buildList.push({
                "name": name,
                "lv": this.state.level,
                "hlv": this.state.hLevel,
                "treeData": JSON.parse(JSON.stringify(this.state.treeData)),
                "usedPoints": 0
            });
            this.setState({
                treeData: this.state.treeData,
                totalUsedPoints: 0,
                buildList: this.state.buildList,
                currentBuild: n - 1,
                currentBuildName: name
            });
        }
    },
    deleteBuild: function(e) {
        e.preventDefault();
        
        var i = this.state.currentBuild,
            l = this.state.buildList.length;
        if (l > 1) {
            this.state.buildList.splice(i, 1);
            
            var n = i;
            if (i == l - 1) {
                n = i - 1;
            }
            var b = this.state.buildList[n];

            this.applyBuildEntry(n, e);
            
            this.setState({
                buildList: this.state.buildList
            });
        }
    },
    applyBuildEntry: function(i, e) {
        e.preventDefault();
        var b = this.state.buildList[i];
        this.setState({
            treeData: JSON.parse(JSON.stringify(b.treeData)),
            totalUsedPoints: b.usedPoints,
            level: b.lv,
            hLevel: b.hlv,
            currentBuild: i,
            currentBuildName: b.name
        });
    },
    editBuildName: function(e) {
        if (e.target.value.substr(-4) != "<br>") {
            var b = this.state.buildList;
            if (b[this.state.currentBuild].name.length < 51) {
                b[this.state.currentBuild].name = e.target.value;
                this.setState({
                    buildList: b,
                    currentBuildName: e.target.value
                });

                buildList = generateList(buildList, this.state.currentBuild, e.target.value, this.state.level, this.state.hLevel, this.state.treeData, this.state.version);
            }
        }
    },
    render: function() {
        if (this.state.listData) {
            var tooltipSkillId = null;
            if (this.state.currentSubSkillId) {
                tooltipSkillId = this.state.currentSubSkillId;
            }
            else {
                tooltipSkillId = this.state.currentSkillId;
            }
            
            var skillNav = 
                <SkillNav
                    buildList={this.state.buildList}
                    currentBuild={this.state.currentBuild}
                    currentBuildName={this.state.currentBuildName}
                    addBuild={this.addBuild}
                    deleteBuild={this.deleteBuild}
                    applyBuildEntry={this.applyBuildEntry}
                    editBuildName={this.editBuildName}
                    versionStatus={this.state.versionStatus}
                    level={this.state.level}
                    hLevel={this.state.hLevel}
                    treeData={this.state.treeData}
                    availablePoints={this.state.availablePoints}
                    usedPoints={this.state.totalUsedPoints}
                    atk={this.state.atk}
                    wpnCnst={this.state.wpnCnst}
                    addDmg={this.state.addDmg}
                    version={this.state.version}
                    handleLevel={this.handleNavLevel}
                    handleHLevel={this.handleNavHLevel}
                    handleAtk={this.handleNavAtk}
                    handleWpnCnst={this.handleNavWpnCnst}
                    handleAddDmg={this.handleNavAddDmg}
                    handleResetAll={this.handleResetAll}
                    fireDmg={this.state.fireDmg}
                    iceDmg={this.state.iceDmg}
                    lightningDmg={this.state.lightningDmg}
                    voidDmg={this.state.voidDmg}
                    windDmg={this.state.windDmg}
                    earthDmg={this.state.earthDmg}
                    handleElemDmg={this.handleNavElemDmg}
                    mode={this.state.mode}
                    handleMode={this.handleMode}
                    testMode={this.state.testMode}
                    toggleTest={this.toggleTest}
                />;
            var skillTree = 
                <SkillTree
                    level={this.state.level}
                    treeData={search(this.state.treeData, this.state.currentTreeId)}
                    listData={search(this.state.listData, this.state.currentSkillId)}
                    tooltipData={search(this.state.tooltipData, tooltipSkillId)}
                    remainingPoints={this.state.availablePoints - this.state.totalUsedPoints}
                    handleLearn={this.handleTreeLearn}
                    handleUnlearn={this.handleTreeUnlearn}
                    handleHover={this.handleTreeHover}
                    handleExit={this.handleTreeExit}
                />;
            
            if (this.state.mode == 0) {
                return (
                    <div className="trainer">
                        {skillNav}
                        <SkillList
                            level={this.state.level}
                            listData={this.state.listData}
                            treeData={this.state.treeData}
                            tooltipData={this.state.tooltipData}
                            currentSkillId={this.state.currentSkillId}
                            currentSubSkillId={this.state.currentSubSkillId}
                            handleClick={this.handleListClick}
                            handleSubClick={this.handleSubListClick}
                            availablePoints={this.state.availablePoints}
                            totalUsedPoints={this.state.totalUsedPoints}
                            mode={this.state.mode}
                        />
                        <div className="tooltip-tree-group col-lg-8">
                            <SkillTooltip
                                atk={this.state.atk}
                                wpnCnst={this.state.wpnCnst}
                                addDmg={this.state.addDmg}
                                currentTreeId={this.state.currentTreeId}
                                currentSkillId={tooltipSkillId}
                                treeData={this.state.treeData}
                                tooltipData={this.state.tooltipData}
                                tempTooltip={this.state.tempTooltip}
                                fireDmg={this.state.fireDmg}
                                iceDmg={this.state.iceDmg}
                                lightningDmg={this.state.lightningDmg}
                                voidDmg={this.state.voidDmg}
                                windDmg={this.state.windDmg}
                                earthDmg={this.state.earthDmg}
                            />
                            {skillTree}
                        </div>
                    </div>
                );
            }
            else if (this.state.mode == 1) {
                var ttDiv = <div className="modal-body">
                            <SkillTooltip
                                atk={this.state.atk}
                                wpnCnst={this.state.wpnCnst}
                                addDmg={this.state.addDmg}
                                currentTreeId={this.state.currentTreeId}
                                currentSkillId={tooltipSkillId}
                                treeData={this.state.treeData}
                                tooltipData={this.state.tooltipData}
                                tempTooltip={this.state.tempTooltip}
                                fireDmg={this.state.fireDmg}
                                iceDmg={this.state.iceDmg}
                                lightningDmg={this.state.lightningDmg}
                                voidDmg={this.state.voidDmg}
                                windDmg={this.state.windDmg}
                                earthDmg={this.state.earthDmg}
                                mode={true}
                            />
                            {skillTree}
                        </div>;
                return (
                    <div className="trainer">
                        {skillNav}
                        <SkillGrid
                            level={this.state.level}
                            listData={this.state.listData}
                            treeData={this.state.treeData}
                            tooltipData={this.state.tooltipData}
                            currentSkillId={this.state.currentSkillId}
                            currentSubSkillId={this.state.currentSubSkillId}
                            handleClick={this.handleListClick}
                            handleSubClick={this.handleSubListClick}
                            availablePoints={this.state.availablePoints}
                            totalUsedPoints={this.state.totalUsedPoints}
                            mode={this.state.mode}
                            
                            atk={this.state.atk}
                            wpnCnst={this.state.wpnCnst}
                            addDmg={this.state.addDmg}
                            tempTooltip={this.state.tempTooltip}
                            fireDmg={this.state.fireDmg}
                            iceDmg={this.state.iceDmg}
                            lightningDmg={this.state.lightningDmg}
                            voidDmg={this.state.voidDmg}
                            windDmg={this.state.windDmg}
                            earthDmg={this.state.earthDmg}
                        />
                        <ModalTT
                            modalBody={ttDiv}
                        />
                    </div>
                );
            }
        }
        else {
            return (
                <div className="trainer">
                    <nav className="navbar navbar-inverse navbar-static-top skillNav"></nav>
                    <div className="skillTree loading">
                        <div className="tree-wrap loading-wrap">
                            <div className="loading-img"></div>
                        </div>
                    </div>
                </div>
            );
        }
    }
});

var ModalTT = React.createClass({
    render: function() {
        return (
            <div className="modal fade" id="gridModal">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        {this.props.modalBody}
                    </div>
                </div>
            </div>
        );
    }
});


var SkillNav = React.createClass({
    getInitialState: function () {
        return {
            dropdownForm: false,
            modalHeader: "",
            widgetW: "800",
            widgetH: "850",
            widgetR: false,
            modalBody: <div className="modal-body"></div>,
            modalFooter: <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                        </div>,
            currentBuildName: this.props.currentBuildName
        };
    },
    handleWidgetW: function(event) {
        this.setState ({
            widgetW: event.target.value
        }, function() {this.modalSave();});
    },
    handleWidgetH: function(event) {
        this.setState ({
            widgetH: event.target.value
        }, function() {this.modalSave();});
    },
    handleWidgetR: function(event) {
        this.setState ({
            widgetR: event.target.checked
        }, function() {this.modalSave();});
    },
    select: function(event) {
        event.target.select();
    },
    resetAll: function(event) {
        event.preventDefault();
        this.props.handleResetAll();
    },
    play: function(event) {
        player.seekTo(0, true);
        player.playVideo();
    },
    modalReset: function() {
        var body =  
            <div className="modal-body">
                <p>This will unlearn all trainings and return points from all skills.</p>
            </div>;
                    
        var footer =    
            <div className="modal-footer">
                <button type="button" className="btn btn-info" data-dismiss="modal" onClick={this.resetAll}>Reset All</button>
                <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
            </div>;
        
        this.setState({
            modalHeader: "Reset",
            modalBody: body,
            modalFooter: footer
        });
        
    },
    modalSave: function() {
        var code = "",
            urlCode = "",
            widgetCode = "",
            url = "https://" + window.location.host + "/" + job,
            widgetUrl = "https://" + window.location.host + "/w/" + job;

        code = generateCode(this.props.level, this.props.hLevel, this.props.treeData, this.props.version);
        
        var ro = this.state.widgetR ? "&readonly=true" : "";
        
        urlCode = url + "?build=" + code;
        widgetCode = "<iframe width=" + this.state.widgetW + " height=" + this.state.widgetH + " src='" + widgetUrl + "?build=" + code + ro + "' frameborder='0'></iframe>";
        
        var body =  
            <div className="modal-body">
                <div className="form-group">
                    <label>Link</label>
                    <input value={urlCode} type="text" className="form-control" onClick={this.select} readonly></input>
                </div>
                <div className="embedGroup">
                    <div className="form-group">
                        <label>Embed</label>
                        <input value={widgetCode} type="text" className="form-control" onClick={this.select} readonly></input>
                    </div>
                    <div className="form-inline row">
                        <div className="form-group col-sm-6">
                            <label>Width</label>
                            <input value={this.state.widgetW} onChange={this.handleWidgetW} type="text" className="form-control"></input>
                        </div>
                        <div className="form-group col-sm-6">
                            <label>Height</label>
                            <input value={this.state.widgetH} onChange={this.handleWidgetH} type="text" className="form-control"></input>
                        </div>
                    </div>
                    <div className="checkbox">
                        <label>
                            <input checked={this.state.widgetR} onChange={this.handleWidgetR} type="checkbox" />Read Only
                        </label>
                    </div>
                </div>
            </div>;
        var footer =    
            <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
            </div>;
        this.setState({
            modalHeader: "Share",
            modalBody: body,
            modalFooter: footer
        });
    },
    modalAbout: function() {
        var body =  
            <div className="modal-body about">
                <h4>BnS Tree Trainer <small>Made by Ar (Di'el / dakaringer) 2016</small></h4>
                <p>Version: 3.6.0</p>
            </div>;
        var footer =    
            <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
            </div>;
        this.setState({
            modalHeader: "About",
            modalBody: body,
            modalFooter: footer
        });
    },
    toggle: function(event) {
        event.preventDefault();
        if (this.state.dropdownForm) {
            this.setState({
                dropdownForm: false
            });
        }
        else {
            this.setState({
                dropdownForm: true
            });
        }
    },
    handleElemDmg: function(type, event) {
        this.props.handleElemDmg(type, event.target.value);
    },
    elemBlur: function(type, event) {
        this.props.handleElemDmg(type, parseFloat(event.target.value).toFixed(2));
    },
    componentDidMount: function() {
        this.forceUpdate();
    },
    render: function() {
        var jobString = "";
        switch (job) {
            case "BM":
                jobString = "Blade Master";
                break;
            case "KF":
                jobString = "Kung Fu Master";
                break;
            case "DE":
                jobString = "Destroyer";
                break;
            case "FM":
                jobString = "Force Master";
                break;
            case "AS":
                jobString = "Assassin";
                break;
            case "SU":
                jobString = "Summoner";
                break;
            case "BD":
                jobString = "Blade Dancer";
                break;
            case "WL":
                jobString = "Warlock";
                break;
            case "SF":
                jobString = "Soul Fighter";
                break;
        }

        var level = [],
            hLevel = [];
        for (var i = 1; i < 51; i++){
            level.push(
                <option>{i}</option>
            );
            if (i < 21) {
                hLevel.push(
                    <option>{i}</option>
                );
            }
        }
        
        var levelInput = null;
        if (readonly) {
            levelInput =
                <select className="form-control" value={this.props.level} onChange={this.props.handleLevel} disabled>
                    {level}
                </select>;
        }
        else {
            levelInput = 
                <select className="form-control" value={this.props.level} onChange={this.props.handleLevel}>
                    {level}
                </select>;
        }
        
        var hLevelInput = null;
        if (this.props.level < 45 || readonly) {
            hLevelInput = 
                <select className="form-control" value={this.props.hLevel} onChange={this.props.handleHLevel} disabled>
                    <option>0</option>
                    {hLevel}
                </select>;
        }
        else {
            hLevelInput = 
                <select className="form-control" value={this.props.hLevel} onChange={this.props.handleHLevel}>
                    <option>0</option>
                    {hLevel}
                </select>;
        }
        
        var code = generateCode(this.props.level, this.props.hLevel, this.props.treeData, this.props.version),
            resetLink = null,
            pubLink = null;
        if (!readonly) {
            resetLink = <li><a href="#"  data-toggle="modal" data-target="#navModal" onClick={this.modalReset}>Reset</a></li>;
        }
        if (!edit && typeof widget == 'undefined' && !this.props.testMode){
            if (loggedin == "false") {
                pubLink = <li><a className="skillNavMenu pub" role="button" onclick="this.blur();" data-toggle="modal" data-target="#login">Post Build</a></li>;
            }
            else {
                pubLink = <li><a className="skillNavMenu pub" href={"/" + job + "/pub?build=" + code}>Post Build</a></li>;
            }
        }
        
        var urlCode = "",
            widgetCode = "",
            url = "/" + job;

        urlCode = url + "?build=" + code;
        
        var message = [];
        if (readonly) {
            message.push(<li><a className="readonly" href={urlCode}>Read Only</a></li>);
        }
        if (this.props.testMode){
            message.push(<li className="readonly">KR Mode</li>);
        }
        if (this.props.versionStatus == 1) {
            message.push(<li className="readonly">Warning: Build may be outdated!</li>);
        }
        else if (this.props.versionStatus == 2) {
            message.push(<li className="outdated">Warning: Build is outdated!</li>);
        }
        
        var mainLink = <a href={"/" + job}>{jobString}</a>;
        if (typeof widget != 'undefined') {
            var c = {
                color: 'aliceblue'
            };
            mainLink = <span style={c}>{jobString}</span>;
        }
        
        var bList = null;
        if (this.props.buildList && edit) {
            var other = [];
            for (var x in this.props.buildList) {
                if (x != this.props.currentBuild) {
                    other.push(<li><a href="#" onClick={this.props.applyBuildEntry.bind(null, x)}>{this.props.buildList[x].name}</a></li>);
                }
            }
            
            if (!readonly) {
                other.push(<li className="divider"></li>);
            
                if (this.props.buildList.length > 1) {
                    other.push(<li><a href="#" onClick={this.props.deleteBuild}><span className="glyphicon glyphicon-remove"></span> Delete current build</a></li>);
                }

                if (this.props.buildList.length < 10) {
                    other.push(<li><a href="#" onClick={this.props.addBuild}><span className="glyphicon glyphicon-plus"></span> Add build</a></li>);
                }
            }
        
            var listUl = null,
                caret = null;
            if (other.length > 0) {
                listUl = 
                    <ul className="dropdown-menu" role="menu">
                        {other}
                    </ul>;
                    
                caret = <strong className="caret"></strong>;
            }
            
            if (!readonly) {
                bList = 
                    <li className="dropdown buildDropdown">
                        <a href="#" className="skillNavMenu dropdown-toggle active" data-toggle="dropdown" role="button" aria-expanded="false"><ContentEditable html={this.props.currentBuildName} onChange={this.props.editBuildName} /> {caret}</a>
                        {listUl}
                    </li>;
            }
            else {
                bList =
                    <li className="dropdown buildDropdown">
                        <a href="#" className="skillNavMenu dropdown-toggle active" data-toggle="dropdown" role="button" aria-expanded="false">{this.props.currentBuildName} {caret}</a>
                        {listUl}
                    </li>;
            }
        }
        
        return (
            <div>
                <nav className="navbar navbar-inverse navbar-static-top skillNav">
                    <div className="container-fluid">

                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#treeNav" aria-expanded="false" aria-controls="navbar">
                                <span className="sr-only">Menu</span>
                                <span className="glyphicon glyphicon-menu-up"></span>
                            </button>
                            <h1 className="subtitle">{mainLink} <a href="#" data-toggle="modal" data-target="#classModal" onClick={this.play}><small>Class Info</small></a></h1>
                            <span data-tooltip={"Used: " + this.props.usedPoints + " / Total: " + this.props.availablePoints} className="counter tooltip-counter">
                                <img height="40" width="40" src="/img/points.png" alt="points"></img>
                                <span className="count">{this.props.availablePoints-this.props.usedPoints}</span>
                            </span>
                        </div>
                        <div className="navbar-collapse collapse" id="treeNav">
                            <form className="navbar-form navbar-left">
                                <div className="form-group">
                                    <label>Level</label>
                                    {levelInput}
                                </div>
                                <div className="form-group">
                                    <label>Hongmoon Level</label>
                                    {hLevelInput}
                                </div>
                                <div className={"form-group dropdown" + (this.state.dropdownForm ? " open" : "")}>
                                    <a className="dropdown-toggle" href="#" onClick={this.toggle}>Advanced <strong className="caret"></strong></a>
                                    <div className="dropdown-menu form-horizontal">
                                        <div className="form-group">
                                            <label>Attack</label>
                                            <input className="form-control" type="number" value={this.props.atk} onClick={this.select} onChange={this.props.handleAtk}>
                                            </input>
                                        </div>
                                        <div className="form-group">
                                            <label>Weapon Constant</label>
                                            <input className="form-control" type="number" value={this.props.wpnCnst} onClick={this.select} onChange={this.props.handleWpnCnst}>
                                            </input>
                                        </div>
                                        <div className="form-group">
                                            <label>Additional Damage</label>
                                            <input className="form-control" type="number" value={this.props.addDmg} onClick={this.select} onChange={this.props.handleAddDmg}>
                                            </input>
                                        </div>
                                        <div className="form-group">
                                            <label>Fire Damage %</label>
                                            <input className="form-control" type="text" value={this.props.fireDmg} onClick={this.select} onBlur={this.elemBlur.bind(null, 'fire')} onChange={this.handleElemDmg.bind(null, 'fire')}>
                                            </input>
                                        </div>
                                        <div className="form-group">
                                            <label>Ice Damage %</label>
                                            <input className="form-control" type="text" value={this.props.iceDmg} onClick={this.select} onBlur={this.elemBlur.bind(null, 'ice')} onChange={this.handleElemDmg.bind(null, 'ice')}>
                                            </input>
                                        </div>
                                        <div className="form-group">
                                            <label>Lightning Damage %</label>
                                            <input className="form-control" type="text" value={this.props.lightningDmg} onClick={this.select} onBlur={this.elemBlur.bind(null, 'lightning')} onChange={this.handleElemDmg.bind(null, 'lightning')}>
                                            </input>
                                        </div>
                                        <div className="form-group">
                                            <label>Void Damage %</label>
                                            <input className="form-control" type="text" value={this.props.voidDmg} onClick={this.select} onBlur={this.elemBlur.bind(null, 'void')} onChange={this.handleElemDmg.bind(null, 'void')}>
                                            </input>
                                        </div>
                                        <div className="form-group">
                                            <label>Wind Damage %</label>
                                            <input className="form-control" type="text" value={this.props.windDmg} onClick={this.select} onBlur={this.elemBlur.bind(null, 'wind')} onChange={this.handleElemDmg.bind(null, 'wind')}>
                                            </input>
                                        </div>
                                        <div className="form-group">
                                            <label>Earth Damage %</label>
                                            <input className="form-control" type="text" value={this.props.earthDmg} onClick={this.select} onBlur={this.elemBlur.bind(null, 'earth')} onChange={this.handleElemDmg.bind(null, 'earth')}>
                                            </input>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <ul className="nav navbar-nav modeToggle">
                                <li className={(this.props.mode == 0 ? " active" : "")}><a href="#" onClick={this.props.handleMode.bind(null, 0)}><span className="glyphicon glyphicon-th-list" aria-hidden="true"> </span> List</a></li>
                                <li className={(this.props.mode == 1 ? " active" : "")}><a href="#"  onClick={this.props.handleMode.bind(null, 1)}><span className="glyphicon glyphicon-th-large" aria-hidden="true"> </span> Grid</a></li>
                            </ul>
                            <ul className="nav navbar-nav navbar-right">
                                {bList}
                                {message}
                                {pubLink}
                                <li className="dropdown">
                                    <a href="#" className="skillNavMenu dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Options <span className="caret"></span></a>
                                    <ul className="dropdown-menu" role="menu">
                                        {resetLink}
                                        <li className={this.props.testMode ? "disabled" : ""}><a href="#" data-toggle="modal" data-target="#navModal" onClick={this.modalSave}>Share</a></li>
                                        <li className="divider"></li>
                                        <li><label><input type="checkbox" checked={this.props.testMode} onClick={this.props.toggleTest} /> KR Mode</label></li>
                                        <li className="divider"></li>
                                        <li><a href="#" data-toggle="modal" data-target="#navModal" onClick={this.modalAbout}>About</a></li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <Modal 
                    modalHeader={this.state.modalHeader}
                    modalBody={this.state.modalBody}
                    modalFooter={this.state.modalFooter}
                />
            </div>
        );
    }
});

var ContentEditable = React.createClass({
    render: function(){
        return <span id="contenteditable"
            onInput={this.emitChange} 
            onBlur={this.blurChange}
            contentEditable
            dangerouslySetInnerHTML={{__html: this.props.html}}></span>;
    },
    shouldComponentUpdate: function(nextProps){
        return nextProps.html != ReactDOM.findDOMNode(this).innerHTML;
    },
    componentDidUpdate: function() {
        if ( this.props.html != ReactDOM.findDOMNode(this).innerHTML ) {
           this.getDOMNode().innerHTML = this.props.html;
        }
    },
    blurChange: function(e){
        e.stopPropagation();
        var html = ReactDOM.findDOMNode(this).innerHTML;
        if (html == "") {
            html = "noname";
        }
        if (this.props.onChange && html != this.lastHtml) {
            this.props.onChange({
                target: {
                    value: html
                }
            });
        }
        this.lastHtml = html;
    },
    emitChange: function(e){
        e.stopPropagation();
        var html = React.findDOMNode(this).innerHTML;
        if (this.props.onChange && html != this.lastHtml) {
            this.props.onChange({
                target: {
                    value: html
                }
            });
        }
        this.lastHtml = html;
    }
});
    
var Modal = React.createClass({
    render: function() {
        return (
            <div className="modal fade" id="navModal">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">{this.props.modalHeader}</h4>
                        </div>
                        {this.props.modalBody}
                        {this.props.modalFooter}
                    </div>
                </div>
            </div>
        );
    }
});

function filterTags (input, tags) {
    for (var t in tags) {
        if (tags[t].toLowerCase().startsWith(input.toLowerCase())){
            return true;
        }
    }
    return false;
}

var SkillList = React.createClass({
    getInitialState: function () {
        return {
            filterInput: "",
            filterMode: false
        };
    },
    scroll: function(key, e) {
        e.preventDefault();
        var element = document.getElementById('keyGroup_' + key);
        element.parentNode.scrollTop = element.offsetTop;
    },
    handleFilterInput: function(e) {
        this.setState({
            filterInput: e.target.value
        });
    },
    clearFilter: function(e) {
        this.setState({
            filterInput: ""
        });
    },
    handleFilterToggle: function(e) {
        this.setState({
            filterMode: !this.state.filterMode
        });
    },
    render: function() {
        var keyGroups = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],
            input = this.state.filterInput.toLowerCase().trim();
        for (var skillIndex in this.props.listData) {
            var skillData = this.props.listData[skillIndex],
                index = 0;
            
            if (input == "" || skillData.name.toLowerCase().startsWith(input) || filterTags(input, skillData.allTags)) {
                if (!this.state.filterMode || skillData.treeId) {
                    switch (this.props.listData[skillIndex].hotkey) {
                        case "LB":
                            index = 0;
                            break;
                        case "RB":
                            index = 1;
                            break;
                        case "F":
                            index = 2;
                            break;
                        case "Tab":
                            index = 3;
                            break;
                        case "1":
                            index = 4;
                            break;
                        case "2":
                            index = 5;
                            break;
                        case "3":
                            index = 6;
                            break;
                        case "4":
                            index = 7;
                            break;
                        case "Z":
                            index = 8;
                            break;
                        case "X":
                            index = 9;
                            break;
                        case "C":
                            index = 10;
                            break;
                        case "V":
                            index = 11;
                            break;
                        case "Q":
                            index = 12;
                            break;
                        case "E":
                            index = 13;
                            break;
                        case "S":
                            index = 14;
                            break;
                        case "None":
                            index = 15;
                            break;
                        case "Familiar":
                            index = 16;
                            break;
                    }
                    keyGroups[index].push(skillData);
                }
            }
        }

        var keyComponents = [];
        var hotkeybar = [];
        for (var i in keyGroups) {
            if (keyGroups[i][0] != null) {
                var hotkey = keyGroups[i][0].hotkey;
                keyComponents.push(
                    <KeyGroup
                        hotkey={hotkey}
                        keySkills={keyGroups[i]}
                        treeData={this.props.treeData}
                        tooltipData={this.props.tooltipData}
                        level={this.props.level}
                        currentSkillId={this.props.currentSkillId}
                        currentSubSkillId={this.props.currentSubSkillId}
                        availablePoints={this.props.availablePoints}
                        totalUsedPoints={this.props.totalUsedPoints}
                        handleClick={this.props.handleClick}
                        handleSubClick={this.props.handleSubClick}
                        mode={this.props.mode}
                    />
                );
                hotkeybar.push(
                    <li><a href="#" onClick={this.scroll.bind(null, hotkey)}>{hotkey}</a></li>
                );
            }
        }
        
        var clear = null;
        if (this.state.filterInput != "") {
            clear = <span className="glyphicon glyphicon-remove" aria-hidden="true" onClick={this.clearFilter}></span>;
        }
        return (
            <div>
                <div className="listFilter"> 
                    <form className="navbar-form">
                        <div className="form-group">
                            <input value={this.state.filterInput} onChange={this.handleFilterInput} type="text" className="form-control" placeholder="Search"></input>
                            {clear}
                        </div>
                        <div className="checkbox">
                            <label><input type="checkbox" checked={this.state.filterMode} onClick={this.handleFilterToggle} />Show trainable only</label>
                        </div>
                    </form>
                </div>
                <SkillListContent components={keyComponents}/>
                <SkillListBar components={hotkeybar}/>
            </div>
        );
    }
});

var SkillListContent = React.createClass({
    mixins: [ScrollLockMixin],
    componentDidMount: function () {
        this.scrollLock();
    },
    render: function() {
        return (
            <div className="skillList col-lg-4" onScroll={this.preventScroll}>
                {this.props.components}
                <div className="buffer"></div>
            </div>
        );
    }
});

var SkillListBar = React.createClass({
    render: function() {
        return (
            <div className="hotkeyBar">
                <ul>
                    {this.props.components}
                </ul>
            </div>
        );
    }
});

var SkillGrid = React.createClass({
    getInitialState: function () {
        return {
            currentGridSkillId: null,
            currentGridTreeId: null,
            filterInput: "",
            filterMode: false
        };
    },
    handleGridHover: function(skillId, treeId) {
        this.setState({
            currentGridSkillId: skillId,
            currentGridTreeId: treeId
        });
    },
    handleGridExit: function() {
        this.setState({
            currentGridSkillId: null,
            currentGridTreeId: null
        });
    },
    handleFilterInput: function(e) {
        this.setState({
            filterInput: e.target.value
        });
    },
    clearFilter: function(e) {
        this.setState({
            filterInput: ""
        });
    },
    handleFilterToggle: function(e) {
        this.setState({
            filterMode: !this.state.filterMode
        });
    },
    render: function() {
        var keyGroups = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],
            input = this.state.filterInput.toLowerCase().trim();
        for (var skillIndex in this.props.listData) {
            var skillData = this.props.listData[skillIndex],
                index = 0;
            if (input == "" || skillData.name.toLowerCase().startsWith(input) || filterTags(input, skillData.allTags)) {
                if (!this.state.filterMode || skillData.treeId) {
                    switch (this.props.listData[skillIndex].hotkey) {
                        case "LB":
                            index = 6;
                            break;
                        case "RB":
                            index = 7;
                            break;
                        case "F":
                            index = 1;
                            break;
                        case "Tab":
                            index = 0;
                            break;
                        case "1":
                            index = 2;
                            break;
                        case "2":
                            index = 3;
                            break;
                        case "3":
                            index = 4;
                            break;
                        case "4":
                            index = 5;
                            break;
                        case "Z":
                            index = 13;
                            break;
                        case "X":
                            index = 14;
                            break;
                        case "C":
                            index = 15;
                            break;
                        case "V":
                            index = 16;
                            break;
                        case "Q":
                            index = 10;
                            break;
                        case "E":
                            index = 11;
                            break;
                        case "S":
                            index = 12;
                            break;
                        case "None":
                            index = 8;
                            break;
                        case "Familiar":
                            index = 9;
                            break;
                    }
                    keyGroups[index].push(skillData);
                }
            }
        }
        var keyA = [],
            keyB = [],
            keyC = [],
            keyD = [],
            keyE = [];
        for (var i in keyGroups) {
            if (keyGroups[i][0] != null) {
                var hotkey = keyGroups[i][0].hotkey,
                    a = <KeyGroup
                            hotkey={hotkey}
                            keySkills={keyGroups[i]}
                            treeData={this.props.treeData}
                            tooltipData={this.props.tooltipData}
                            level={this.props.level}
                            currentSkillId={this.props.currentSkillId}
                            currentSubSkillId={this.props.currentSubSkillId}
                            availablePoints={this.props.availablePoints}
                            totalUsedPoints={this.props.totalUsedPoints}
                            handleClick={this.props.handleClick}
                            handleGridHover={this.handleGridHover}
                            handleGridExit={this.handleGridExit}
                            handleSubClick={this.props.handleSubClick}
                            mode={this.props.mode}
                        />;
                switch (true) {
                    case (i < 2):
                        keyA.push(a);
                        break;
                    case (i < 6):
                        keyB.push(a);
                        break;
                    case (i < 10):
                        keyC.push(a);
                        break;
                    case (i < 13):
                        keyD.push(a);
                        break;
                    default:
                        keyE.push(a);
                }
            }
        }
        
        var gridTooltip = null;
        if (this.props.tooltipData && this.state.currentGridSkillId) {
            gridTooltip = 
                <SkillTooltip
                    atk={this.props.atk}
                    wpnCnst={this.props.wpnCnst}
                    addDmg={this.props.addDmg}
                    currentTreeId={this.state.currentGridTreeId}
                    currentSkillId={this.state.currentGridSkillId}
                    treeData={this.props.treeData}
                    tooltipData={this.props.tooltipData}
                    tempTooltip={this.props.tempTooltip}
                    fireDmg={this.props.fireDmg}
                    iceDmg={this.props.iceDmg}
                    lightningDmg={this.props.lightningDmg}
                    voidDmg={this.props.voidDmg}
                    windDmg={this.props.windDmg}
                    earthDmg={this.props.earthDmg}
                    mode={true}
                    noPush={true}
                />;
        }
        
        var clear = null;
        if (this.state.filterInput != "") {
            clear = <span className="glyphicon glyphicon-remove" aria-hidden="true" onClick={this.clearFilter}></span>;
        }
        
        return (
            <div>
                <div className="skillGrid col-lg-8">
                    <div className="listFilter"> 
                        <form className="navbar-form">
                            <div className="form-group">
                                <input value={this.state.filterInput} onChange={this.handleFilterInput} type="text" className="form-control" placeholder="Search"></input>
                                {clear}
                            </div>
                            <div className="checkbox">
                                <label><input type="checkbox" checked={this.state.filterMode} onClick={this.handleFilterToggle} />Show trainable only</label>
                            </div>
                        </form>
                    </div>
                    <div className="gridWraper">
                        <div className="gridTop">
                            <div className="primaryBlock">
                                <div className="gridBlock group_A">
                                    {keyA}
                                </div>
                            </div>
                            <div className="secondaryBlock">
                                <div className="gridBlock group_B">
                                    {keyB}
                                </div>
                                <div className="gridBlock group_C">
                                    {keyC}
                                </div>
                            </div>
                        </div>
                        <div className="gridBottom">
                            <div className="primaryBlock">
                                <div className="gridBlock group_D">
                                    {keyD}
                                </div>
                            </div>
                            <div className="secondaryBlock">
                                <div className="gridBlock group_E">
                                    {keyE}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="gridTooltip col-lg-4">
                    {gridTooltip}
                </div>
            </div>
        );
    }
});

var KeyGroup = React.createClass({
    render: function() {
        var skillGroup = [];
        for (var s in this.props.keySkills) {
            skillGroup.push(
                <ListEntry
                    key={s}
                    level={this.props.level}
                    currentSkillId={this.props.currentSkillId}
                    currentSubSkillId={this.props.currentSubSkillId}
                    availablePoints={this.props.availablePoints}
                    totalUsedPoints={this.props.totalUsedPoints}
                    skillId={this.props.keySkills[s]._id}
                    treeId={this.props.keySkills[s].treeId}
                    tooltipData={this.props.tooltipData}
                    treeData={this.props.treeData}
                    listData={this.props.keySkills[s]}
                    handleClick={this.props.handleClick}
                    handleGridHover={this.props.handleGridHover}
                    handleGridExit={this.props.handleGridExit}
                    handleSubClick={this.props.handleSubClick}
                    mode={this.props.mode}
                    index={s}
                />
            );
        }
        if (this.props.mode == 0) {
            return (
                <dl className="keyGroup" id={"keyGroup_" + this.props.hotkey}>
                    <dt><strong>{this.props.hotkey}</strong></dt>
                    <dd><ul>
                        {skillGroup}
                    </ul></dd>
                </dl>
            );
        }
        else if (this.props.mode == 1) {
            var width = Math.ceil(this.props.keySkills.length / 4.0);
            return (
                <div className={"keyGridGroup width_" + width + " group_" + this.props.hotkey}>
                    {skillGroup}
                    <span className="keyLabel">{this.props.hotkey}</span>
                </div>
            );
        }
    }
});

var ListEntry = React.createClass({
    render: function() {
        var displayUsedPoints = null,
            overlay = null;
        var treeData = search(this.props.treeData, this.props.treeId),
            skillData = this.props.listData,
            tooltipData = search(this.props.tooltipData, this.props.skillId),
            name = skillData.name,
            icon = skillData.icon,
            classification = "",
            element = [];
            
        var disable = false,
            t = null,
            complete = false;
        if (typeof treeData != "undefined") {
            if (treeData.status != "0") {
                var childrenArray = searchPos(treeData.nodes, treeData.status).children;
                if (!childrenArray) {
                    complete = true;
                }
                else {
                    for (var child in childrenArray) {
                        if (searchPos(treeData.nodes, childrenArray[child]).locked) {
                            complete = true;
                            break;
                        }
                    }
                }
                classification = "Tier" + treeData.status.charAt(0) + " Form" + treeData.status.charAt(1);
            }
            else if (this.props.availablePoints > this.props.totalUsedPoints) {
                classification = "Trainable";
            }
            displayUsedPoints = <span className={"list-counter" + (complete ? " complete" : "")}>{treeData.usedPoints}</span>;
            
            if (tooltipData) {
                var s = 0;
                if (tooltipData.excluded  && tooltipData.excluded.indexOf(treeData.status) != -1) {
                    s = lastValid(tooltipData.excluded, treeData.nodes, treeData.status);
                }
                else if (tooltipData.excluded2  && tooltipData.excluded2.indexOf(treeData.status) != -1) {
                    s = lastValid(tooltipData.excluded, treeData.nodes, treeData.status);
                }
                else if (tooltipData.fixed && tooltipData.fixed.indexOf(treeData.status) == -1) {
                    s = tooltipData.fixed[0];
                }
                else {
                    s = treeData.status;
                }
                t = searchPos(tooltipData.nodes, s);
                if (t.element) {
                    element.push(<img height="20" width="20" className="element-img" src={"/img/skill_attack_" + t.element + ".png"}></img>);
                }
                else if (t.multiElement) {
                    for (var m in t.multiElement) {
                        element.push(<img height="20" width="20" className="element-img" src={"/img/skill_attack_" + t.multiElement[m] + ".png"}></img>);
                    }
                }
            }
        }
        else {
            if (tooltipData) {
                t = tooltipData.nodes[0];
                if (t.element) {
                    element.push(<img height="20" width="20" className="element-img" src={"/img/skill_attack_" + t.element + ".png"}></img>);
                }
                else if (t.multiElement) {
                    for (var n in t.multiElement) {
                        element.push(<img height="20" width="20" className="element-img" src={"/img/skill_attack_" + t.multiElement[n] + ".png"}></img>);
                    }
                }
                else if (t.depElement) {
                    var depE = searchPos(search(this.props.tooltipData, t.depElement).nodes, search(this.props.treeData, t.depElement).status).element;
                    element.push(<img height="20" width="20" className="element-img" src={"/img/skill_attack_" + depE + ".png"}></img>);
                }
            }
        }

        if (treeData && skillData.disableFlag) {
            disable = treeData.learned.indexOf(skillData.disableFlag) == -1;
        }

        if (skillData.change) {
            for (var c in skillData.change) {
                if (treeData.learned.indexOf(skillData.change[c].flag) != -1) {
                    name = skillData.change[c].name;
                    icon = skillData.change[c].icon;
                }
            }
        }

        if (this.props.level < skillData.minLevel) {
            overlay = <span className="lock"></span>;
        }
        else if (!readonly && treeData && !complete && this.props.availablePoints > this.props.totalUsedPoints) {
            overlay = <span className="plus"></span>;
        }

        if (this.props.level < skillData.minLevel) {
            classification = "Level " + skillData.minLevel + " required";
        }
        
        var entries = [];
        if (this.props.mode == 0) {
            entries.push(
                <li className={"listEntry" + ((skillData._id == this.props.currentSkillId) ? " selected" : "") + ((disable || (this.props.level < skillData.minLevel)) ? " disabled" : "")} onClick={this.props.handleClick.bind(null, skillData._id, skillData.treeId)}>
                    <span className="thumb">
                        <img height="64" width="64" src={"/img/skill/" + icon + ".png"} alt="list-icon"></img>
                        {overlay}
                        {displayUsedPoints}
                    </span>
                    <span className={"name" + (treeData != null ? " tree-exists" : "")}>
                        {name}
                    </span>
                    <span className="element">
                        {element}
                    </span>
                    <span className={"classification" + ((this.props.level < skillData.minLevel) ? " disabled" : "")}>
                        {classification}
                    </span>
                </li>
            );
        }
        else if (this.props.mode == 1) {
            entries.push(
                <div className={"gridEntry index_" + this.props.index + ((skillData._id == this.props.currentSkillId) ? " selected" : "") + ((disable || (this.props.level < skillData.minLevel)) ? " disabled" : "")} onClick={this.props.handleClick.bind(null, skillData._id, skillData.treeId)} onMouseOver={this.props.handleGridHover.bind(null, skillData._id, skillData.treeId)} onMouseOut={this.props.handleGridExit}>
                    <div className="thumb">
                        <img height="50" width="50" src={"/img/skill/" + icon + ".png"} alt="list-icon"></img>
                        <span className="gridElement">{element}</span>
                        {overlay}
                        {displayUsedPoints}
                    </div>
                    <div className={"name" + (treeData != null ? " tree-exists" : "")}>
                        {name}
                    </div>
                </div>
            );
        }
        
        if (skillData.subEntry && skillData._id == this.props.currentSkillId && this.props.mode == 0) {
            var subEntries = [];
            for (var k in skillData.subEntry) {
                var sname = skillData.subEntry[k].name;
                var sicon = skillData.subEntry[k].icon;
                if (treeData && skillData.subEntry[k].disableFlag) {
                    disable = treeData.learned.indexOf(skillData.subEntry[k].disableFlag) == -1;
                }
                else if (treeData && skillData.subEntry[k].revDisableFlag) {
                    disable = treeData.learned.indexOf(skillData.subEntry[k].revDisableFlag) != -1;
                }
                if (skillData.subEntry[k].change) {
                    for (var sc in skillData.subEntry[k].change) {
                        if (treeData.learned.indexOf(skillData.subEntry[k].change[sc].flag) != -1) {
                            sname = skillData.subEntry[k].change[sc].name;
                            sicon = skillData.subEntry[k].change[sc].icon;
                        }
                    }
                }
                if (!(disable || (this.props.level < skillData.minLevel))) {
                    subEntries.push(
                        <li className={"listEntry subEntry" + ((skillData.subEntry[k].id == this.props.currentSubSkillId) ? " selected" : "")} onClick={this.props.handleSubClick.bind(null, skillData.subEntry[k].id)}>
                            <span className="thumb">
                                <img height="64" width="64" src={"/img/skill/" + sicon + ".png"} alt="list-icon"></img>
                            </span>
                            <span className={"name" + (treeData != null ? " tree-exists" : "")}>
                                {sname}
                            </span>
                        </li>
                    );
                }
            }
            entries.push(
                <div className="subEntryDiv">
                    {subEntries}
                </div>
            );
        }

        return (
            <div>
                {entries}
            </div>
        );
    }
});

function commonT (a1, a2, nodes) {
    var result = [];
    for (var x in a1) {
        if (a2.indexOf(a1[x]) != -1) {
            result = result.concat(searchPos(nodes, a1[x]).tags);
        }
    }
    return result;
}

//Tree
var SkillTree = React.createClass({
    render: function() {
        var tree = this.props.treeData,
            tooltips = this.props.tooltipData,
            list = this.props.listData,
            displayTree = [],
            possibleNodes = [],
            width = "",
            treePoints = null,
            labelW = [],
            labelH = [],
            w,
            h,
            tagStatus = "0",
            currentTags = [];
            
        if (tree) {
            treePoints = <div className="tree-point">Used points: {tree.usedPoints}</div>;
            if (tree.status == 0) {
                possibleNodes = getChildren(searchPos(tree.nodes, "11"), tree);
            }
            else {
                possibleNodes = getChildren(searchPos(tree.nodes, tree.status), tree);
            }
            
            if (tree.dimensions) {
                w = tree.dimensions[0];
                h = tree.dimensions[1];
            }
            else {
                w = 1;
                h = 1;
                for (var n in tree.nodes) {
                    if (tree.nodes[n].position > 0) {
                        var nodeH = parseInt(tree.nodes[n].position.charAt(0)),
                            nodeW = parseInt(tree.nodes[n].position.charAt(1));
                        if (nodeH > h) {
                            h = nodeH;
                        }
                        if (nodeW > w) {
                            w = nodeW;
                        }
                        if (h == 5 && w == 4) {
                            break;
                        }
                    }
                }
                tree.dimensions = [w, h];
            }
            
            switch (w) {
                case 1:
                    width = " col-1";
                    break;
                case 2:
                    width = " col-2";
                    break;
                case 3:
                    width = " col-3";
                    break;
                case 4:
                    width = " col-4";
                    break;
            }
            for (var x = 1; x <= w; x++){
                labelW.push(<span className={"FLabel F" + x}>{"F" + x}</span>);
            } 
            for (var y = 1; y <= h; y++){
                labelH.push(<span className={"TLabel T" + y}>{"T" + y}</span>);
            } 
            
            for (var o in this.props.treeData.nodes) {
                displayTree.push(
                    <NodeGroup
                        key={o}
                        level={this.props.level}
                        minLevel={list.minLevel}
                        remainingPoints={this.props.remainingPoints}
                        pos={this.props.treeData.nodes[o].position}
                        possibleNodes={possibleNodes}
                        treeData={tree}
                        handleLearn={this.props.handleLearn}
                        handleUnlearn={this.props.handleUnlearn}
                        handleHover={this.props.handleHover}
                        handleExit={this.props.handleExit}
                    />
                );
            }
            tagStatus = tree.status;     
            if (tooltips.excluded && !tooltips.parent2) {
                currentTags = commonT(tooltips.excluded, tree.learned, tooltips.nodes);
                currentTags = currentTags.concat(searchPos(tooltips.nodes, lastValid(tooltips.excluded, tree.nodes, tree.status)).tags);
            }
            
            if (tooltips.individuals) {
                for (var i in tooltips.individuals) {
                    if (tree.learned.indexOf(tooltips.individuals[i]) != -1) {
                        currentTags = currentTags.concat(searchPos(tooltips.nodes, tooltips.individuals[i]).tags);
                    }
                }
            }
            else if (tooltips.fixed && tooltips.fixed.indexOf("-1") != -1) {
                currentTags = currentTags.concat(searchPos(tooltips.nodes, "-1").tags);
            }
            else if (tooltips.fixed) {
                currentTags = currentTags.concat(commonT(tooltips.fixed, tree.learned, tooltips.nodes));
                currentTags = currentTags.concat(searchPos(tooltips.nodes, lastValid(tooltips.fixed, tree.nodes, tree.status)).tags);
            }
        }
        else {
            var name = "";
            var substring = " does not have a tree";
            displayTree = <p className="no-tree"><span className="skill-name">{list.name}</span>{substring}</p>;
        }
        
        currentTags = currentTags.concat(searchPos(tooltips.nodes, tagStatus).tags);
        var allTags = list.allTags;
        var tags = [];
        for (var a in allTags) {
            var active = typeof currentTags != "undefined" && currentTags.indexOf(allTags[a]) != -1;
            tags.push(
                <SkillTag active={active} tag={allTags[a]} />
            );
        }
        
        var col = " col-sm-6 col-sm-pull-6";
        if (typeof widget != 'undefined') {
            col = " col-xs-6 col-xs-pull-6";
        }
        
        return (
            <div className={"skillTree" + col}>
                {treePoints}
                <div className={"tree-wrap" + width}>
                    <div className="labelW">{labelW}</div>
                    <div className="labelH">{labelH}</div>
                    {displayTree}
                </div>
                <hr/>
                <div className="tagGroup">
                    {tags}
                </div>
            </div>
        );
    }
});

var NodeGroup = React.createClass({
    render: function() {
        return (
            <div className={"node-group pos_" + this.props.pos}>
                <Path
                    treeData={this.props.treeData}
                    pos={this.props.pos}
                    remainingPoints={this.props.remainingPoints}
                >
                </Path>
                <Node
                    level={this.props.level}
                    minLevel={this.props.minLevel}
                    treeData={this.props.treeData}
                    pos={this.props.pos}
                    possibleNodes={this.props.possibleNodes}
                    remainingPoints={this.props.remainingPoints}
                    handleLearn={this.props.handleLearn}
                    handleUnlearn={this.props.handleUnlearn}
                    handleHover={this.props.handleHover}
                    handleExit={this.props.handleExit}
                >
                </Node>
            </div>
        );
    }
});

var Node = React.createClass({
    learn: function(event) {
        var tree = this.props.treeData,
            node = searchPos(tree.nodes, this.props.pos),
            parentNode = searchPos(tree.nodes, node.parent),
            lvCondition = this.props.level >= this.props.minLevel,
            learning = getParents(node, tree, 0),
            pointCondition = this.props.remainingPoints + tree.usedPoints >= learning[1];
        
        var learnable = !node.locked && lvCondition && pointCondition;
            
        if (!readonly && learnable) {
            this.props.handleLearn(learning[0], learning[1]);
        }
    },
    unlearn: function(event) {
        event.preventDefault();
        var tree = this.props.treeData,
            node = searchPos(tree.nodes, this.props.pos);
        if (!readonly && tree.learned.indexOf(node.position) != -1) {
            this.props.handleUnlearn(node.position, node.points, node.parent);
        }
    },
    touch: function(event) {
        event.preventDefault();
        this.props.handleExit();
        var tree = this.props.treeData,
            node = searchPos(tree.nodes, this.props.pos),
            parentNode = searchPos(tree.nodes, node.parent);
        if (!readonly) {
            if (tree.learned.indexOf(node.position) != -1) {
                this.props.handleUnlearn(node.position, node.points, node.parent);
            }
            else {
                var lvCondition = this.props.level >= this.props.minLevel,
                    learning = getParents(node, tree, 0),
                    pointCondition = this.props.remainingPoints + tree.usedPoints >= learning[1];

                var learnable = !node.locked && lvCondition && pointCondition;
            
                if (learnable) {
                    this.props.handleLearn(learning[0], learning[1]);
                }
            }
        }
    },
    render: function() {
        var tree = this.props.treeData,
            node = searchPos(tree.nodes, this.props.pos),
            parentNode = searchPos(tree.nodes, node.parent),
            overlay = [],
            lvCondition = this.props.level >= this.props.minLevel,
            notLearnedCondition = tree.learned.indexOf(node.position) == -1,
            learning = getParents(node, tree, 0),
            pointCondition = this.props.remainingPoints + tree.usedPoints >= learning[1];
        
        var learnable = !node.locked && lvCondition && pointCondition && notLearnedCondition;

        if (!readonly && learnable) {
            overlay = <span className="overlay plus"></span>;
        }
        else if (!readonly && this.props.remainingPoints + tree.usedPoints < learning[1] && !node.locked && lvCondition && notLearnedCondition && this.props.level > 14) {
            overlay = <span className="overlay no-points"></span>;
        }
        else if (node.req && tree.learned.indexOf(node.position) == -1) {
            var type = node.req;
            overlay = <span className={"overlay " + type}></span>;
        }

        var tooltip = null;
        if (node.points > 1) {
            tooltip = "Requires " + node.points + " points";
        }

        var frame = null;
        if (node.points > 1) {
            if (node.points == 2) {
                frame = <div className="elite1"></div>;
            }
            else if (node.points == 3) {
                frame = <div className="elite2"></div>;
            }
        }

        return (
            <div>
                <div className={"node-wrap" + (node.position == tree.status ? " current-node" : "")}>
                    <div data-tooltip={tooltip} className={(node.points > 1 ? "tooltip-point " : "") + "node" + ((tree.learned.indexOf(node.position) != -1) ? " active" : "") + (!readonly && learnable ? " learnable" : "")} onTouchStart={this.props.handleHover.bind(null, this.props.pos)} onTouchEnd={this.touch} onClick={this.learn} onContextMenu={this.unlearn} onMouseOver={this.props.handleHover.bind(null, this.props.pos)} onMouseOut={this.props.handleExit}>
                        <img height="50" width="50" src={'/img/skill/' + node.icon + '.png'} alt="node-icon"></img>
                        {overlay}
                    </div>
                </div>,
                {frame}
            </div>
        );
    }
});

var Path = React.createClass({
    render: function() {
        var arrows = [],
            tree = this.props.treeData,
            node = searchPos(tree.nodes, this.props.pos),
            parentNode = searchPos(tree.nodes, node.parent);
        if (node.parent){
            var diff = 0;
            if (node.skip) {
                diff = node.skip - node.parent;
                var skip = node.position - node.skip;
                arrows.push(
                    <span className={"line line_"+diff+" skip_"+skip}></span>,
                    <span className={"arrow skip_"+skip}></span>,
                    <span className="glyphicon glyphicon-triangle-bottom" aria-hidden="true"></span>
                );
            }
            else {
                diff = node.position - node.parent;
                arrows.push(
                    <span className={"line line_"+diff}></span>,
                    <span className="arrow"></span>,
                    <span className="glyphicon glyphicon-triangle-bottom" aria-hidden="true"></span>
                );
            }
        }
        return (
            <div className={"path " + (tree.learned.indexOf(node.position) != -1 ? "active" : "")}>
                {arrows}
            </div>
        );
    }
});


function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function parser (obj, atk, add, c, multipliers, depE) {
    if (obj) {
        var after = obj.after || "";
        if (!obj.type || obj.type == "mod") {
            return obj.value;
        }
        else if (obj.type == "damage") {
            var top = 0,
                bottom = 0,
                scale = "",
                before = obj.before || "Deals ",
                eleimg = null,
                m = 1,
                element = obj.element || "";
            
            if (depE) {
                element = depE;
            }
                
            switch (element) {
                case 'fire':
                    m = parseFloat(multipliers[0])/100.00;
                    break;
                case 'ice':
                    m = parseFloat(multipliers[1])/100.00;
                    break;
                case 'lightning':
                    m = parseFloat(multipliers[2])/100.00;
                    break;
                case 'void':
                    m = parseFloat(multipliers[3])/100.00;
                    break;
                case 'wind':
                    m = parseFloat(multipliers[4])/100.00;
                    break;
                case 'earth':
                    m = parseFloat(multipliers[5])/100.00;
                    break;
            }
                
            if (obj.dualScale) {
                scale = " [" + obj.dualScale[0] + ", " + obj.dualScale[1] + "] ";
                bottom = numberWithCommas(Math.round((atk - c) * obj.dualScale[0] * m) + add);
                top = numberWithCommas(Math.round((atk + c) * obj.dualScale[1] * m) + add);
            }
            else {
                scale = " [" + obj.scale.toFixed(2) + "] ";
                bottom = numberWithCommas(Math.round(Math.round((atk - c) * obj.scale) * m + add));
                top = numberWithCommas(Math.round(Math.round((Number(atk) + Number(c)) * obj.scale) * m + add));
            }
                
            if (after.trim() != "") {
                after = " " + after;
            }
            if (before != "Deals ") {
                before = before + " deals ";
            }
            if (element != "") {
                eleimg = <img height="20" width="20" className="element-img" src={"/img/skill_attack_" + element + ".png"}></img>;
            }
            if (obj.ex) {
                return [
                    <span>{before + " " + bottom + " ~ " + top}</span>,
                    <span className="scale">{scale}</span>,
                    <span>{obj.ex + " " + element + " damage" + after}</span>, 
                    eleimg
                ];
            }
            else if (obj.increasing) {
                return [
                    <span>{"Damage dealt increases by " + bottom + " ~ " + top}</span>,
                    <span className="scale">{scale}</span>,
                    <span>{element + " damage" + after}</span>,
                    eleimg
                ];
            }
            else {
                return [
                    <span>{before + " " + bottom + " ~ " + top}</span>,
                    <span className="scale">{scale}</span>,
                    <span>{element + " damage" + after}</span>, 
                    eleimg
                ];
            }
        }
        else if (obj.type == "number") {
            return obj.before + " " + obj.num + " " + after;
        }
        else if (obj.type == "percent") {
            return obj.before + " " + obj.num + "% " + after;
        }
        else if (obj.type == "distance") {
            return obj.before + " " + obj.num + "m " + after;
        }
    }
    else {
        return "";
    }
}

function groupCompare (temp, current, atk, add, c, multipliers, m1) {
    var result = [];
    m1 = m1 || null;
    
    var found,
        modded,
        moddedNum,
        modMod,
        modding;
    for (var i in temp) {
        found = false;
        modded = false;
        moddedNum = false;
        modMod  = " ";
        modding = null;
        
        if (m1 && JSON.stringify(m1) == JSON.stringify(temp[i])) {
            found = true;
        }
        else {
            for (var j in current){
                if (JSON.stringify(current[j]) == JSON.stringify(temp[i])) {
                    found = true;
                    break;
                }
                else if (current[j].type == "damage" && temp[i].type == "damage" && current[j].modId == temp[i].modId) {
                    modded = true;
                    modding = parser(current[j], atk, add, c, multipliers);
                    break;
                }
                else if ((current[j].type == "number" || current[j].type == "percent" || current[j].type == "distance") && current[j].type == temp[i].type && current[j].modId == temp[i].modId) {
                    var modifier = " ";
                    switch (current[j].type) {
                        case "percent":
                            modifier = "% ";
                            break;
                        case "distance":
                            modifier = "m ";
                            break;
                    }
                    if (current[j].num != temp[i].num) {
                        modMod = modifier;  
                        moddedNum = true;
                        modding = current[j].num;
                    }
                    else {
                        modded = true;
                        modding = current[j].before + " " + current[j].num + modifier + (current[j].after || "");
                    }
                    break;
                }
                else if (current[j].type == "mod" && temp[i].type == "mod" && current[j].modId == temp[i].modId) {
                    modded = true;
                    modding = current[j].value;
                    break;
                }
            }
        }
        
        var after = temp[i].after || "";
        if (found) {
            result.push(
                <p>{parser(temp[i], atk, add, c, multipliers)}</p>
            );
        }
        else if (moddedNum) {
            result.push(
                <p className="mod">{temp[i].before + " " + modding} <span className="glyphicon glyphicon-play" aria-hidden="true"></span> {temp[i].num + modMod + after}<span className="label label-warning">Mod</span></p>
            );
        }
        else if (modded) {
            result.push(
                <p className="mod">{parser(temp[i], atk, add, c, multipliers)}<span className="label label-warning">Mod</span></p>,
                <p className="strike">{modding}</p>
            );
        }
        else {
            result.push(
                <p className="new" alt="add">{parser(temp[i], atk, add, c, multipliers)}<span className="label label-success">New</span></p>
            );
        }
    }

    for (var k in current) {
        found = false;
        modded = false;
        
        for (var l in temp) {
            if (JSON.stringify(current[k]) == JSON.stringify(temp[l])) {
                found = true;
                break;
            }
            else if (current[k].type && current[k].type == temp[l].type && current[k].modId == temp[l].modId) {
                modded = true;
                break;
            }
        }

        if (!(found || modded)) {
            result.push(
                <p className="strike">{parser(current[k], atk, add, c, multipliers)}</p>
            );
        }
    }

    return result;
}

function attbCompare (temp, current) {
    var result = [];
    
    var found,
        modded,
        modding;
    for (var i in temp) {
        found = false;
        modded = false;
        modding = null;
            
        for (var j in current){
            if (current[j].value == temp[i].value) {
                found = true;
                break;
            }
            else if (current[j].type && temp[i].type && current[j].type == "mod" && temp[i].type == "mod" && current[j].modId == temp[i].modId) {
                modded = true;
                modding = current[j];
                break;
            }
        }

        if (found) {
            result.push(
                <p>
                    <img height="20" width="20" className="cond-icon" src={"/img/skill/" + temp[i].image + ".png"} alt="cond-icon"></img>
                    {temp[i].value} {temp[i].or ? "OR" : ""}
                </p>
            );
        }
        else if (modded) {
            result.push(
                <p className="mod">
                    <img height="20" width="20" className="cond-icon" src={"/img/skill/" + temp[i].image + ".png"} alt="cond-icon"></img>
                    {temp[i].value} {temp[i].or ? "OR" : ""}<span className="label label-warning">Mod</span>
                </p>
            );
            result.push(
                <p className="strike">
                    <img height="20" width="20" className="cond-icon" src={"/img/skill/" + modding.image + ".png"} alt="cond-icon"></img>
                    {modding.value} {modding.or ? "OR" : ""}
                </p>
            );
        }
        else {
            result.push(
                <p className="new">
                    <img height="20" width="20" className="cond-icon" src={"/img/skill/" + temp[i].image + ".png"} alt="cond-icon"></img>
                    {temp[i].value} {temp[i].or ? "OR" : ""}<span className="label label-success">New</span>
                </p>
            );
        }
    }
    
    for (var k in current) {
        found = false;
        modded = false;
        for (var l in temp) {
            if (current[k].value == temp[l].value) {
                found = true;
                break;
            }
            else if (current[k].type == "mod" && current[k].type == temp[l].type && current[k].modId == temp[l].modId) {
                modded = true;
                break;
            }
        }

        if (!(found || modded)) {
            result.push(
                <p className="strike">
                    <img height="20" width="20" className="cond-icon" src={"/img/skill/" + current[k].image + ".png"} alt="cond-icon"></img>
                    {current[k].value}
                </p>
            );
        }
    }

    return result;
}

function lastValid (excluded, treeNodes, node) {
    if (node == "0") {
        return "0";
    }
    else {
        var parentPos = searchPos(treeNodes, node).parent;
        if (!parentPos) {
            return "0";
        }
        else if (excluded.indexOf(parentPos) != -1) {
            return lastValid (excluded, treeNodes, parentPos);
        }
        else {
            return parentPos;
        }
    }
}

//Tooltip
var SkillTooltip = React.createClass({
    mixins: [ScrollLockMixin],
    componentDidMount: function () {
        if (this.props.mode) {
            this.scrollLock();
        }
    },
    render: function() {
        var tree = search(this.props.treeData, this.props.currentTreeId),
            tempNode = this.props.tempTooltip,
            tooltip = search(this.props.tooltipData, this.props.currentSkillId),
            classification = "",
            m1 = [],
            m2 = [],
            sub = [],
            chi = [],
            infoRange = [],
            infoArea = [],
            infoCast = [],
            infoCooldown = [],
            cond = [],
            stance = [],
            acquire = [],
            icon = "",
            name = "",
            element = [];
            
        var multipliers = [
            this.props.fireDmg,
            this.props.iceDmg,
            this.props.lightningDmg,
            this.props.voidDmg,
            this.props.windDmg,
            this.props.earthDmg,
        ];
        
        var currentTooltip = null,
            tempTooltip = null;
        if (tree) {
            if (tempNode) {
                classification = "Tier " + tempNode.charAt(0) + " Form " + tempNode.charAt(1) + " ";
            
                tempTooltip = searchPos(tooltip.nodes, tempNode);
                if (tooltip.parent2 && tooltip.parent2 == tempNode && tree.learned.indexOf(tempNode) == -1) {
                    currentTooltip = searchPos(tooltip.nodes, "-1");
                }
                else if (tooltip.parent2 && tooltip.parent2 == tree.status && tree.learned.indexOf(tempNode) == -1) {
                    currentTooltip = searchPos(tooltip.nodes, "0");
                }
                else if (tooltip.excluded && tooltip.excluded.indexOf(tempNode) != -1) {
                    if (tooltip.excluded.indexOf(tree.status) == -1) {
                        currentTooltip = searchPos(tooltip.nodes, tooltip.excluded[tooltip.excluded.length - 1]);
                    }
                    else {
                        currentTooltip = searchPos(tooltip.nodes, tree.status);
                    }
                }
                else if (tooltip.excluded && tooltip.excluded.indexOf(tree.status) != -1) {
                    currentTooltip = searchPos(tooltip.nodes, lastValid(tooltip.excluded, tree.nodes, tree.status));
                }
                else if (tooltip.excluded2 && tooltip.excluded2.indexOf(tempNode) != -1) {
                    if (tooltip.excluded2.indexOf(tree.status) == -1) {
                        currentTooltip = searchPos(tooltip.nodes, tooltip.excluded2[tooltip.excluded2.length - 1]);
                    }
                    else {
                        currentTooltip = searchPos(tooltip.nodes, tree.status);
                    }
                }
                else if (tooltip.excluded2 && tooltip.excluded2.indexOf(tree.status) != -1) {
                    currentTooltip = searchPos(tooltip.nodes, lastValid(tooltip.excluded2, tree.nodes, tree.status));
                }
                else if (tooltip.individuals && tooltip.individuals.indexOf(tempNode) != -1) {
                    currentTooltip = searchPos(tooltip.nodes, tempNode);
                }
                else if (tooltip.individuals && tooltip.individuals.indexOf(tempNode) == -1 && tree.learned.indexOf(tempNode) != -1) {
                    currentTooltip = searchPos(tooltip.nodes, tempNode);
                }
                else if (tooltip.fixed) {
                    var fPos = tooltip.fixed[0];
                    if (tooltip.fixed.indexOf(tempNode) != -1) {
                        if (tooltip.fixed.indexOf(tree.status) != -1) {
                            fPos = tree.status;
                        }
                    }
                    else if (tooltip.fixed.indexOf(tree.status) == -1) {
                        fPos = tree.status;
                    }
                    else {
                        fPos = lastValid(tooltip.fixed, tree.nodes, tree.status);
                    }
                    currentTooltip = searchPos(tooltip.nodes, fPos);
                }
                else {
                    currentTooltip = searchPos(tooltip.nodes, tree.status);
                }
            }
            else {
                if (tooltip.fixed) {
                    var fPos2 = tooltip.fixed[0];
                    if (tooltip.alt && tree.learned.indexOf(tooltip.alt.flag) != -1) {
                        fPos2 = tooltip.alt.target;
                    }
                    else {
                        for (var f in tooltip.fixed) {
                            if (tree.learned.indexOf(tooltip.fixed[f]) != -1) {
                                fPos2 = tooltip.fixed[f];
                            }
                        }
                    }
                    classification = "Tier " + fPos2.charAt(0) + " Form " + fPos2.charAt(1) + " ";
                    currentTooltip = searchPos(tooltip.nodes, fPos2);
                }
                else if (tooltip.excluded && tooltip.excluded.indexOf(tree.status) != -1) {
                    currentTooltip = searchPos(tooltip.nodes, lastValid(tooltip.excluded, tree.nodes, tree.status));
                }
                else if (tooltip.excluded2 && tooltip.excluded2.indexOf(tree.status) != -1) {
                    currentTooltip = searchPos(tooltip.nodes, lastValid(tooltip.excluded2, tree.nodes, tree.status));
                }
                else {
                    currentTooltip = searchPos(tooltip.nodes, tree.status);
                }
                
                if (tree.status != 0 && !tooltip.fixed){
                    classification = "Tier " + tree.status.charAt(0) + " Form " + tree.status.charAt(1) + " ";
                }
            }
        }
        else {
            currentTooltip = tooltip.nodes[0];
        }
        
        if (tempNode) {
            icon = tempTooltip.icon;
            name = tempTooltip.name;
        }
        else {
            icon = currentTooltip.icon;
            name = currentTooltip.name;
        }
        
        var depE = null;
        if (tempTooltip && tempTooltip.element) {
            element = <img height="20" width="20" className="element-img" src={"/img/skill_attack_" + tempTooltip.element + ".png"}></img>;
        }
        else if (currentTooltip && currentTooltip.element) {
            element = <img height="20" width="20" className="element-img" src={"/img/skill_attack_" + currentTooltip.element + ".png"}></img>;
        }
        else if (tempTooltip && tempTooltip.multiElement) {
            for (var i in tempTooltip.multiElement) {
                element.push(<img height="20" width="20" className="element-img" src={"/img/skill_attack_" + tempTooltip.multiElement[i] + ".png"}></img>);
            }
        }
        else if (currentTooltip && currentTooltip.multiElement) {
            for (var j in currentTooltip.multiElement) {
                element.push(<img height="20" width="20" className="element-img" src={"/img/skill_attack_" + currentTooltip.multiElement[j] + ".png"}></img>);
            }
        }
        else if (currentTooltip && currentTooltip.depElement) {
            depE = searchPos(search(this.props.tooltipData, currentTooltip.depElement).nodes, search(this.props.treeData, currentTooltip.depElement).status).element;
            element = <img height="20" width="20" className="element-img" src={"/img/skill_attack_" + depE + ".png"}></img>;
        }

        var chiModded = false;
        if (tempTooltip) {
            if (currentTooltip.chi != tempTooltip.chi) {
                if (currentTooltip.chi > 0) {
                    chi.push(
                        <span>{"Generates " + currentTooltip.chi} </span>,
                        <span className="glyphicon glyphicon-play" aria-hidden="true"></span>
                    );
                }
                else if (currentTooltip.chi < 0) {
                    chi.push(
                        <span>{"Costs " + currentTooltip.chi*-1} </span>,
                        <span className=" glyphicon glyphicon-play" aria-hidden="true"></span>
                    );
                }
                var prefix = "";
                if (tempTooltip.chi > 0) {
                    if (currentTooltip.chi <= 0) {
                        prefix = "Generates ";
                    }
                    chi.push(
                        <span className="mod"> {prefix + tempTooltip.chi}</span>
                    );
                }
                else if (tempTooltip.chi < 0 ) {
                    if (currentTooltip.chi >= 0) {
                        prefix = "Costs ";
                    }
                    chi.push(
                        <span className="mod"> {prefix + tempTooltip.chi*-1}</span>
                    );
                }
                else if (tempTooltip.chi == 0 ) {
                    chi.push(
                        <span className="mod"> 0</span>
                    );

                }
                chi.push(
                    <span className="mod"> Focus</span>
                );
                chiModded = true;
            }
        }
        if (!chiModded) {
            if (currentTooltip.chi > 0) {
                chi.push(
                    <span>{"Generates " + currentTooltip.chi + " Focus"}</span>
                );
            }
            else if (currentTooltip.chi < 0) {
                chi.push(
                    <span>{"Costs " + currentTooltip.chi*-1 + " Focus"}</span>
                );
            }
        }

        var m1Modified = false;
        if (tempTooltip) {
            if (Array.isArray(tempTooltip.m1) && JSON.stringify(currentTooltip.m1) != JSON.stringify(tempTooltip.m1)) {
                m1 = groupCompare(tempTooltip.m1, currentTooltip.m1, this.props.atk, this.props.addDmg, this.props.wpnCnst, multipliers);
                m1Modified = true;
            }
            else {
                var after = tempTooltip.m1.after || "";
                if (JSON.stringify(currentTooltip.m1) != JSON.stringify(tempTooltip.m1)) {
                    var numMod = false,
                        in2 = false;
                    m1 = [];
                    if (currentTooltip.m1.type == "damage" && tempTooltip.m1.type == "damage") {
                        m1.push (
                            <p className="mod">{parser(tempTooltip.m1, this.props.atk, this.props.addDmg, this.props.wpnCnst, multipliers, depE)}<span className="label label-warning">Mod</span></p>
                        );
                    }
                    else if ((currentTooltip.m1.type == "number" || currentTooltip.m1.type == "percent" || currentTooltip.m1.type == "distance") && currentTooltip.m1.type == tempTooltip.m1.type) {
                        var modifier = " ";
                        switch (currentTooltip.m1.type) {
                            case "percent":
                                modifier = "% ";
                                break;
                            case "distance":
                                modifier = "m ";
                                break;
                        }
                        
                        if (currentTooltip.m1.num != tempTooltip.m1.num) {
                            m1.push (
                                <p className="mod">{tempTooltip.m1.before + " " + currentTooltip.m1.num} <span className="glyphicon glyphicon-play" aria-hidden="true"></span> {tempTooltip.m1.num + modifier + after}<span className="label label-warning">Mod</span></p>
                            );
                        }
                        else {
                            m1.push (
                                <p className="mod">{tempTooltip.m1.before + " " + tempTooltip.m1.num + modifier + after}<span className="label label-warning">Mod</span></p>
                            );
                        }
                        numMod = true;
                    }
                    else if (currentTooltip.m1.type == "mod" && tempTooltip.m1.type == "mod") {
                        m1.push (
                            <p className="mod">{parser(tempTooltip.m1, this.props.atk, this.props.addDmg, this.props.wpnCnst, multipliers)}<span className="label label-warning">Mod</span></p>
                        );
                    }
                    else {
                        m1.push (
                            <p className="new">{parser(tempTooltip.m1, this.props.atk, this.props.addDmg, this.props.wpnCnst, multipliers)}<span className="label label-success">New</span></p>
                        );
                    }
                    if (tempTooltip.m2) {
                        for (var m in tempTooltip.m2) {
                            if (JSON.stringify(tempTooltip.m2[m]) == JSON.stringify(currentTooltip.m1)) {
                                in2 = true;
                            }
                        }
                    }
                    if (!numMod && !in2) {
                        if (Array.isArray(currentTooltip.m1)) {
                            for (var k in currentTooltip.m1) {
                                m1.push(
                                    <p className="strike">{parser(currentTooltip.m1[k], this.props.atk, this.props.addDmg, this.props.wpnCnst, multipliers)}</p>
                                );
                            }
                        }
                        else {
                            m1.push (
                                <p className="strike">{parser(currentTooltip.m1, this.props.atk, this.props.addDmg, this.props.wpnCnst, multipliers)}</p>
                            );
                        }
                    }
                    m1Modified = true;
                }
            }
        }
        if (!m1Modified) {
            if (Array.isArray(currentTooltip.m1)) {
                for (var l in currentTooltip.m1) {
                    m1.push(
                        <p>{parser(currentTooltip.m1[l], this.props.atk, this.props.addDmg, this.props.wpnCnst, multipliers)}</p>
                    );
                }
            }
            else {
                m1 = <p>{parser(currentTooltip.m1, this.props.atk, this.props.addDmg, this.props.wpnCnst, multipliers, depE)}</p>;
            }
        }

        var m2Modified = false;
        if (tempTooltip) {
            if (JSON.stringify(currentTooltip.m2) != JSON.stringify(tempTooltip.m2)) {
                m2 = groupCompare(tempTooltip.m2, currentTooltip.m2, this.props.atk, this.props.addDmg, this.props.wpnCnst, multipliers, currentTooltip.m1);
                m2Modified = true;
            }
        }
        if (!m2Modified) {
            for (var n in currentTooltip.m2) {
                m2.push(
                    <p>{parser(currentTooltip.m2[n], this.props.atk, this.props.addDmg, this.props.wpnCnst, multipliers)}</p>
                );
            }
        }

        var subModified = false;
        if (tempTooltip) {
            if (JSON.stringify(currentTooltip.sub) != JSON.stringify(tempTooltip.sub)) {
                sub = groupCompare(tempTooltip.sub, currentTooltip.sub, this.props.atk, this.props.addDmg, this.props.wpnCnst, multipliers);
                subModified = true;
            }
        }
        if (!subModified) {
            for (var o in currentTooltip.sub) {
                sub.push(
                    <p>{parser(currentTooltip.sub[o], this.props.atk, this.props.addDmg, this.props.wpnCnst, multipliers)}</p>
                );
            }
        }

        if (!currentTooltip.nosubinfo) {
            var rangeModified = false;
            if (tempTooltip && !tempTooltip.nosubinfo) {
                if (currentTooltip.range != tempTooltip.range) {
                    infoRange =
                        <div className="info-box">
                            <div className="info-header">Range</div>
                            <div className="info">
                                <div className="diff">{currentTooltip.range}</div>
                                <div className="glyphicon glyphicon-triangle-bottom" aria-hidden="true"></div>
                                <div className="diff mod">{tempTooltip.range}</div>
                            </div>
                        </div>;
                    rangeModified = true;
                }
            }
            if (!rangeModified) {
                infoRange =
                    <div className="info-box">
                        <div className="info-header">Range</div>
                        <div className="info"><span>{currentTooltip.range}</span></div>
                    </div>;
            }

            var areaModified = false;
            if (tempTooltip && !tempTooltip.nosubinfo) {
                if (JSON.stringify(currentTooltip.area) != JSON.stringify(tempTooltip.area)) {
                    if (currentTooltip.area.type != tempTooltip.area.type) {
                        infoArea =
                            <div className="info-box">
                                <div className="info-header">Area</div>
                                <div className="info">
                                    <div className={"diff area_" + currentTooltip.area.type}>{currentTooltip.area.value}</div>
                                    <div className="glyphicon glyphicon-triangle-bottom" aria-hidden="true"></div>
                                    <div className={"diff mod area_" + tempTooltip.area.type}>{tempTooltip.area.value}</div>
                                </div>
                            </div>;
                    }
                    else {
                        infoArea =
                            <div className="info-box">
                                <div className="info-header">Area</div>
                                <div className={"info area_" + tempTooltip.area.type}>
                                    <div className="diff">{currentTooltip.area.value}</div>
                                    <div className="glyphicon glyphicon-triangle-bottom" aria-hidden="true"></div>
                                    <div className="diff mod">{tempTooltip.area.value}</div>
                                </div>
                            </div>;
                    }
                    areaModified = true;
                }
            }
            if (!areaModified) {
                infoArea =
                    <div className="info-box">
                        <div className="info-header">Area</div>
                        <div className={"info area_" + currentTooltip.area.type}><span>{currentTooltip.area.value}</span></div>
                    </div>;
            }

            var castModified = false;
            if (tempTooltip && !tempTooltip.nosubinfo) {
                if (currentTooltip.cast != tempTooltip.cast) {
                    infoCast =
                        <div className="info-box">
                            <div className="info-header">Cast Time</div>
                            <div className="info">
                                <div className="diff">{currentTooltip.cast}</div>
                                <div className="glyphicon glyphicon-triangle-bottom" aria-hidden="true"></div>
                                <div className="diff mod">{tempTooltip.cast}</div>
                            </div>
                        </div>;
                    castModified = true;
                }
            }
            if (!castModified) {
                infoCast =
                    <div className="info-box">
                        <div className="info-header">Cast Time</div>
                        <div className="info"><span>{currentTooltip.cast}</span></div>
                    </div>;
            }

            var cooldownModified = false;
            if (tempTooltip && !tempTooltip.nosubinfo) {
                if (currentTooltip.cooldown != tempTooltip.cooldown) {
                    infoCooldown =
                        <div className="info-box">
                            <div className="info-header">Cooldown</div>
                            <div className="info">
                                <div className="diff">{currentTooltip.cooldown}</div>
                                <div className="glyphicon glyphicon-triangle-bottom" aria-hidden="true"></div>
                                <div className="diff mod">{tempTooltip.cooldown}</div>
                            </div>
                        </div>;
                    cooldownModified = true;
                }
            }
            if (!cooldownModified) {
                infoCooldown =
                    <div className="info-box">
                        <div className="info-header">Cooldown</div>
                        <div className="info"><span>{currentTooltip.cooldown}</span></div>
                    </div>;
            }
        }

        var conditionModified = false;
        if (tempTooltip) {
            if (JSON.stringify(currentTooltip.condition) != JSON.stringify(tempTooltip.condition)) {
                cond.push(
                    <p className="cond-header">Requirements</p>
                );
                cond.push(attbCompare(tempTooltip.condition, currentTooltip.condition));
                conditionModified = true;
            }
        }
        if (currentTooltip.condition && !conditionModified) {
            cond.push(
                <p className="cond-header">Requirements</p>
            );
            for (var p in currentTooltip.condition) {
                cond.push(
                    <p>
                        <img height="20" width="20" className="cond-icon" src={"/img/skill/" + currentTooltip.condition[p].image + ".png"} alt="cond-icon"></img> 
                        {currentTooltip.condition[p].value} {currentTooltip.condition[p].or ? "OR" : ""}
                    </p>
                );
            }
        }

        var stanceModified = false;
        if (tempTooltip) {
            if (JSON.stringify(currentTooltip.stanceChange) != JSON.stringify(tempTooltip.stanceChange)) {
                cond.push(
                    <p className="cond-header">Change Stance</p>
                );
                cond.push(attbCompare(tempTooltip.stanceChange, currentTooltip.stanceChange));
                stanceModified = true;
            }
        }
        if (currentTooltip.stanceChange && !stanceModified) {
            cond.push(
                <p className="cond-header">Change Stance</p>
            );
            for (var q in currentTooltip.stanceChange) {
                cond.push(
                    <p>
                        <img height="20" width="20" className="cond-icon" src={"/img/skill/" + currentTooltip.stanceChange[q].image + ".png"} alt="cond-icon"></img>
                        {currentTooltip.stanceChange[q].value}
                    </p>
                );
            }
        }
        
        var acq = null;
        if (tempTooltip && tempTooltip.acquire) {
            acq = tempTooltip.acquire;
        }
        else if (currentTooltip.acquire) {
            acq = currentTooltip.acquire;
        }

        if (acq) {
            var type = "";

            if (acq.type == "locked") {
                cond.push(
                    <p className="cond-header">Unreleased</p>,
                    <p>
                        <span className="unreleased">"It is said that this secret technique is only found in legends"</span>
                    </p>
                );
            }
            else if (acq.type == "achievement") {
                type = "Achievement: ";
                cond.push(
                    <p className="cond-header">Unlock Required</p>,
                    <p>
                        <img height="20" width="20" className="cond-icon" src="/img/achievement.png" alt="acq-icon"></img>
                        {type}<span className="achievement">{acq.value}</span>
                    </p>
                );
            }
            else if (acq.type == "book") {
                type = "Skill book: ";
                cond.push(
                    <p className="cond-header">Unlock Required</p>,
                    <p>
                        {type}<span className={acq.type == "book" ? "item" : "other"}>{acq.value}</span>
                    </p>,
                    <p>Acquired from</p>
                );
                for (var lo in acq.location) {
                    cond.push(
                        <p className="extra-info">
                            <img height="20" width="20" className="cond-icon" src={"/img/" + acq.location[lo].image + ".png"} alt="acq-icon"></img>
                            <span className={acq.location[lo].type}>{acq.location[lo].loc}</span>
                        </p>
                    );
                }
            }
        }
        
        var tags = [];
        if (tempTooltip) {
            for (var a in tempTooltip.tags) {
                tags.push(<SkillTag active={true} tag={tempTooltip.tags[a]} />);
            }
            for (var b in currentTooltip.tags) {
                if (!(tempTooltip.tags && tempTooltip.tags.indexOf(currentTooltip.tags[b]) != -1)) {
                    tags.push(<SkillTag active={false} tag={currentTooltip.tags[b]} />);
                }
            }
        }
        else {
            for (var c in currentTooltip.tags) {
                tags.push(<SkillTag active={true} tag={currentTooltip.tags[c]} />);
            }
        }
        
        var col = " col-sm-6 col-sm-push-6";
        if (this.props.noPush) {
            col = " col-sm-6";
        }
        if (typeof widget != 'undefined') {
            col = " col-xs-6 col-xs-push-6";
        }

        return (
            <div className={"skillTooltip " + col}>
                <div className="tooltip-wrap">
                    <div className="chi">{chi}</div>
                    <h3 className="tooltip-name">
                        {name}
                        <small className="classification"> {classification}</small>
                        {element}
                    </h3>
                    <span className="icon"><img height="64" width="64" src={"/img/skill/" + icon + ".png"} alt="tooltip-icon"></img></span>
                    <div className="main-info">
                        <div className="m1">{m1}</div>
                        <div className="m2">{m2}</div>
                    </div>
                    <div className="sub">{sub}</div>
                    <div className="container skill-info">
                        {infoRange}
                        {infoArea}
                        {infoCast}
                        {infoCooldown}
                    </div>
                    <div className="cond">{cond}</div>
                    <div className="tagGroup">{tags}</div>
                </div>
            </div>
        );
    }
});

var SkillTag = React.createClass({
    render: function() {
        var definition = "";
        switch (this.props.tag) {
            case "Windwalk":
                definition = "This skill is used while windwalking.";
                break;
            case "Movement":
                definition = "Move a short distance. Can be used while snared, charge disabled. Removes snares.";
                break;
            case "Speed Increase":
                definition = "Increases movement speed.";
                break;
            case "Threat Increase":
                definition = "Generates additional threat or boosts threat generated by other skills.";
                break;
            case "Taunt":
                definition = "Causes enemies to attack the user.";
                break;
            case "Charge":
                definition = "Closes the gap between the user and the enemy. Removes snares. Cannot be used while charge disabled.";
                break;
            case "Projectile":
                definition = "Projectile type skill. Cannot be used to hit enemies that resist projectiles.";
                break;
            case "Defense":
                definition = "Defense type skill. Cannot defend defense penetration, defense break type skills and cannot be used while defense disabled.";
                break;
            case "Block":
                definition = "Blocks enemy attacks. Damage taken is decreased or negated.";
                break;
            case "Counter":
                definition = "Counters an enemy attack and activates special effects or skills. Damage taken is decreased or negated.";
                break;
            case "Deflect":
                definition = "Deflects enemy attacks. Negates damage and stuns the attacking enemy for a short duration on deflect.";
                break;
            case "Offensive-Defense":
                definition = "Has both offensive and defensive traits to attack and defend simultaneously. Cannot be used while offensive-defense disabled.";
                break;
            case "Bleed":
                definition = "Causes enemies to bleed. Bleeding enemies take damage over time and has decreased in combat health regen.";
                break;
            case "Deep Wound":
                definition = "Reduces healing.";
                break;
            case "Slow":
                definition = "Slows enemy movement speed.";
                break;
            case "Joint Attack":
                definition = "Can be used to disable bosses in conjunction with other joint attack skills.";
                break;
            case "Knockdown":
                definition = "Knocks enemies down. Knockdown enemies can use an escape skill to recover and cannot act.";
                break;
            case "Stun":
                definition = "Stuns enemies. Stunned enemies can use an escape skill to recover and cannot act.";
                break;
            case "Daze":
                definition = "Dazes enemies. Dazed enemies can use an escape skill to recover and cannot act.";
                break;
            case "Knockback":
                definition = "Knocks enemies back a certain distance.";
                break;
            case "Knockup":
                definition = "Knocks enemies into the air. Airborne enemies cannot act.";
                break;
            case "Unconscious":
                definition = "Knocks enemies unconscious. Unconscious enemies cannot act but restores health over time. They can use an escape skill to recover.";
                break;
            case "Pull":
                definition = "Pulls enemies to the user's or a certain location.";
                break;
            case "Chill":
                definition = "Slows enemies and prevents them from using any charge skills for a short duration. Freezes enemies at 3 stacks.";
                break;
            case "Freeze":
                definition = "A type of snare.";
                break;   
            case "Deep Freeze":
                definition = "Locks enemies in ice. The ice breaks on hit.";
                break;  
            case "Frost Prison":
                definition = "Locks enemies in ice. Locked enemies are resistant to damage, status effects.";
                break; 
            case "Snare":
                definition = "Roots enemies in place. Snared enemies cannot turn.";
                break;
            case "Grab":
                definition = "Holds the enemy in the air. Grabbed enemies have limited actions. It is possible to move with the Grabbed enemy.";
                break;
            case "Phantom Grip":
                definition = "Holds the enemy in the air. Phantom Gripped enemies have limited actions. It is possible to move with the Phantom Gripped enemy.";
                break;
            case "Grapple":
                definition = "Holds the enemy on the floor. Grappled enemies have limited actions.";
                break;
            case "Defense Penetration":
                definition = "Hits enemies even when they are defending. Cannot be blocked or evaded.";
                break;
            case "Deflect Penetration":
                definition = "Hits enemies even when they are deflecting.";
                break;
            case "Defense Break":
                definition = "Hits enemies even when they are defending and cancels their defense skill.";
                break;
            case "Charge Disable":
                definition = "Prevents enemies from using any charge skills for a short duration.";
                break;
            case "Defense Disable":
                definition = "Prevents enemies from using any defense skills for a short duration.";
                break;
            case "Offensive-Defense Disable":
                definition = "Prevents enemies from using any offensive-defense skills for a short duration.";
                break;
            case "Survivability":
                definition = "Increases block, evade, defense, or damage reduction to increase survivability";
                break;
            case "Escape":
                definition = "Break out of status effects.";
                break;
            case "Damage Resistance":
                definition = "Immunity to damage. Some boss's wipe attacks cannot be avoided.";
                break;
            case "Status Effect Resistance":
                definition = "Immunity to status effects.";
                break;
            case "Projectile Resistance":
                definition = "Immunity to projectiles.";
                break;
            case "Familiar":
                definition = "Requires the Familiar.";
                break;
            case "Passive":
                definition = "Passive skill.";
                break;
            case "Party Buff":
                definition = "Enhances party members' offense.";
                break;
            case "Soulburn":
                definition = "Unlocks party members' Awakened skills. Soulburned party members cannot be Soulburned again for a set duration.";
                break;
            case "Amplification":
                definition = "Increases party members' critical hit chance, critical hit damage and gives additional lifesteal. Amplified party members cannot be Amplified again for a set duration.";
                break;
            case "Restrain":
                definition = "Allows party members to use their Restricted skills";
                break;
            case "Shroud":
                definition = "Prevents auto targeting from other players";
                break;
            case "Time Distortion":
                definition = "Refreshes all cooldowns of party members' skills except ones that cannot be refreshed. Affected party members cannot be have their cooldowns refreshed again for a set duration.";
                break;
            case "Party Protection":
                definition = "Protects party members.";
                break;
            case "Blade Protection":
                definition = "Protects party members from damage, status effects. Protected party members cannot be protected again by a Blade Protection skill for a set duration.";
                break;
            case "Ice Protection":
                definition = "Protects party members from damage, status effects. Protected party members cannot be protected again by a Ice Protection skill for a set duration.";
                break;
            case "Stealth Protection":
                definition = "Protects party members from damage, status effects. Protected party members cannot be protected again by a Stealth Protection skill for a set duration.";
                break;
            case "Revival":
                definition = "Revives dead party members. Revived party members cannot be resurrected again for a set duration";
                break;
            case "Awakened":
                definition = "This skill is only available while Soulburned by a Warlock.";
                break;
        }
        return (
            <span className={"tag tooltip-tag" + (this.props.active ? " active" : "")} data-tooltip={definition}>{this.props.tag}</span>
        );
    }
});

if (isNode) {
    exports.Trainer = Trainer;
} else {
    ReactDOM.render(
        <Trainer />,
        document.getElementById('training-wrap')
    );
}
