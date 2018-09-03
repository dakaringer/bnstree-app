/*!
    project: bns-training
    update: 2014-12-16 10:32:26 AM
    author: ncsoft-khs + modded by Di'el
*/
var nc;
var current;
nc || (nc = {}), nc.bns || (nc.bns = {}), nc.bns.training || (nc.bns.training = {}),
    function () {
        "use strict";
        nc.bns.training.Model = {}, nc.bns.training.Model.SORT_INPUT_ARR = ["LB", "RB", "F", "TAB", "1", "2", "3", "4", "Z", "X", "C", "V", "Q", "E", "W", "S", "NONE"], nc.bns.training.Model.SORT_INPUT_OBJ = {
            LB: {
                category: "LB",
                value: "LB"
            },
            RB: {
                category: "RB",
                value: "RB"
            },
            F: {
                category: "F",
                value: "F"
            },
            TAB: {
                category: "TAB",
                value: "TAB"
            },
            1: {
                category: "1",
                value: "1"
            },
            2: {
                category: "2",
                value: "2"
            },
            3: {
                category: "3",
                value: "3"
            },
            4: {
                category: "4",
                value: "4"
            },
            Z: {
                category: "Z",
                value: "Z"
            },
            X: {
                category: "X",
                value: "X"
            },
            C: {
                category: "C",
                value: "C"
            },
            V: {
                category: "V",
                value: "V"
            },
            Q: {
                category: "Q",
                value: "Q"
            },
            E: {
                category: "E",
                value: "E"
            },
            W: {
                category: "W",
                value: "W"
            },
            S: {
                category: "S",
                value: "S"
            },
            NONE: {
                category: "None",
                value: ""
            }
        }, nc.bns.training.Model.SORT_LEVEL_ARR = ["5", "10", "15", "20", "25", "30", "35", "40", "45", "50"], nc.bns.training.Model.SORT_POSE_ARR = [], nc.bns.training.Model.SORT_NAME_ARR = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"], nc.bns.training.Model.JOB_NAME_OBJ = {
            FM: "Force Master",
            BM: "Blade Master",
            KF: "Kung-Fu Master",
            SU: "Summoner",
            DE: "Destroyer",
            AS: "Assassin",
            SM: "Lyn Blade Master",
            WL: "Warlock"
        }, nc.bns.training.Model.SKILL_IMG_URL_FRONT = "../img/skill/", nc.bns.training.Model.NO_TRAINING_DESC = " does not have a skill tree.", nc.bns.training.Model.CATEGORY_MOVE_POSY_PER_MOUSE_WHEEL = 31, nc.bns.training.Model.MIN_LEVEL_CAN_USE_SKILL_POINT = 15, nc.bns.training.Model.MIN_LEVEL_CAN_USE_MASTERY_LEVEL = 50, nc.bns.training.Model.LEVEL_SWITCH_MASTERY_LEVEL_RANGE = 50, nc.bns.training.Model.MASTERY_LEVEL_RANGE_BY_LEVEL_OBJ = {
            50: "20"
        }, nc.bns.training.Model.MASTERY_LEVEL_POINTS = {
            0: 0,
            1: 5,
            2: 1,
            3: 2,
            4: 1,
            5: 2,
            6: 1,
            7: 2,
            8: 1,
            9: 2,
            10: 1,
            11: 2,
            12: 1,
            13: 2,
            14: 1,
            15: 2,
            16: 1,
            17: 2,
            18: 1,
            19: 2,
            20: 1
        }, nc.bns.training.Model.FIRST_ITEM_SLOT_NO = "11", nc.bns.training.Model.SKILL_TYPE_NONE = "SKILL_TYPE_NONE", nc.bns.training.Model.NO_DISABLE = "NO_DISABLE", nc.bns.training.Model.SKILL_TYPE_HIDDEN = "SKILL_TYPE_HIDDEN", nc.bns.training.Model.SKILL_TYPE_ACQUISITION = "SKILL_TYPE_ACQUISITION", nc.bns.training.Model.SKILL_TYPE_SHARE = "SKILL_TYPE_SHARE", nc.bns.training.Model.SLOT_ACQUISITION = "SLOT_ACQUISITION", nc.bns.training.Model.SLOT_REPLACE = "SLOT_REPLACE", nc.bns.training.Model.CUSTOM_CATEGORY_OBJ_ARR = [], nc.bns.training.Model.CATEGORY_OBJ_ARR = [], nc.bns.training.Model.SLOT_OBJ_JSON = null, nc.bns.training.Model.SKILL_OBJ_JSON = null, nc.bns.training.Model.DATA_SKILL_TOOLTIP_OBJ_JSON = null, nc.bns.training.Model.DATA_SKILL_TOOLTIP_ATTRIBUTE_OBJ_JSON = null, nc.bns.training.Model.COLLECTION_ARRAY_HAS_SKILL_OBJ_JSON_BY_SKILL_ID = {}, nc.bns.training.Model.sortOptionIndex = 1, nc.bns.training.Model.level = 1, nc.bns.training.Model.masteryLevel = 0, nc.bns.training.Model.job = "", nc.bns.training.Model.masteryTitle = "", nc.bns.training.Model.maxLevel = 0, nc.bns.training.Model.editable = !0, nc.bns.training.Model.skillPointTotal = 0, nc.bns.training.Model.skillPointConsumed = 0, nc.bns.training.Model.skillPointRemained = 0, nc.bns.training.Model.lastSelectedSkillListSkillId = "", nc.bns.training.Model.lastSelectedSkillType = "", nc.bns.training.Model.wheelScrollCategoryContainerPosY = 0
    }();
var nc;
nc || (nc = {}), nc.bns || (nc.bns = {}), nc.bns.training || (nc.bns.training = {}),
    function (a) {
        "use strict";
        nc.bns.training.select = {}, nc.bns.training.select.SelectLevel = function (b) {
            function c() {
                h = a("> strong", m), i = a(".ly_level", m).get(0), f(!1);
                for (var b, c = j, g = k; g >= c; c++) b = document.createElement("li"), a(b).text(String(c)), a(b).on("click", e), i.appendChild(b), n.push(b);
                return l ? void a(m).on("click", d) : void a(m).css("cursor", "auto")
            }

            function d(b) {
                switch (b.preventDefault(), b.stopPropagation(), b.type) {
                case "click":
                    o ? (f(!1), o = !1) : (f(!0), o = !0, a(g).trigger({
                        type: nc.bns.training.select.SelectLevel.OPEN_SELECT_LEVEL
                    }))
                }
            }

            function e(b) {
                switch (b.preventDefault(), b.type) {
                case "click":
                    var c = b.currentTarget,
                        d = a(c).text();
                    h.text(d), a(g).trigger({
                        type: nc.bns.training.select.SelectLevel.SELECT_LEVEL,
                        level: parseInt(d)
                    })
                }
            }

            function f(a) {
                i && (i.style.display = a ? "block" : "none")
            }
            var g = this;
            g.destroy = function () {
                if (m) {
                    a(m).off("click", d);
                    for (var b, c = 0, f = n.length; f > c; c++) b = n[c], a(b).off("click", e);
                    n = []
                }
            }, g.displayLevel = function (a) {
                h.text(String(a))
            }, g.openByExternal = function (a) {
                f(a), o = a
            };
            var h, i, j = b.minLevelCanUseSkillPoint,
                k = b.maxLevel,
                l = b.editable,
                m = b.container,
                n = [],
                o = !1;
            return c(), g
        }, nc.bns.training.select.SelectLevel.SELECT_LEVEL = "SELECT_LEVEL", nc.bns.training.select.SelectLevel.OPEN_SELECT_LEVEL = "OPEN_SELECT_LEVEL", nc.bns.training.select.SelectMasteryLevel = function (b) {
            function c() {
                h = a("> strong", j), i = a(".ly_level", j).get(0), f(!1), k || a(j).css("cursor", "auto")
            }

            function d(b) {
                switch (b.preventDefault(), b.stopPropagation(), b.type) {
                case "click":
                    l ? (f(!1), l = !1) : (f(!0), l = !0, a(g).trigger({
                        type: nc.bns.training.select.SelectMasteryLevel.OPEN_MASTERY_SELECT_LEVEL
                    }))
                }
            }

            function e(b) {
                switch (b.preventDefault(), b.type) {
                case "click":
                    var c = b.currentTarget,
                        d = a(c).text();
                    h.text(d), a(g).trigger({
                        type: nc.bns.training.select.SelectMasteryLevel.SELECT_MASTERY_LEVEL,
                        level: parseInt(d)
                    })
                }
            }

            function f(a) {
                i && (i.style.display = a ? "block" : "none")
            }
            var g = this;
            g.destroy = function () {
                if (j) {
                    a(j).off("click", d);
                    for (var b, c = a("li", j), f = 0, g = c.size(); g > f; f++) b = c[f], a(b).off("click", e)
                }
            }, g.openByExternal = function (a) {
                f(a), l = a
            }, g.switchMasteryLevelLange = function (b) {
                a(i).empty();
                for (var c, d = parseInt(b), f = 0, g = d; g >= f; f++) c = document.createElement("li"), a(c).text(String(f)), i.appendChild(c), a(c).on("click", e)
            }, g.displayMasteryLevel = function (a) {
                h.text(String(a))
            }, g.setMouseInteraction = function (b) {
                nc.bns.training.Model.editable && (a(j).off("click", d), b ? (a(j).on("click", d), a(j).css("cursor", "pointer")) : a(j).css("cursor", "auto"))
            };
            var h, i, j = b.container,
                k = b.editable,
                l = !1;
            return c(), g
        }, nc.bns.training.select.SelectMasteryLevel.SELECT_MASTERY_LEVEL = "SELECT_MASTERY_LEVEL", nc.bns.training.select.SelectMasteryLevel.OPEN_MASTERY_SELECT_LEVEL = "OPEN_MASTERY_SELECT_LEVEL"
    }(jQuery);
var nc;
nc || (nc = {}), nc.bns || (nc.bns = {}), nc.bns.training || (nc.bns.training = {}),
    function (a) {
        "use strict";
        nc.bns.training.category = {}, nc.bns.training.category.Contents = function (b) {
            function c(a, b) {
                var c = nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr(a),
                    d = nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr(b);
                c && d && d.skillType != nc.bns.training.Model.SKILL_TYPE_NONE && (d.consumedSkillPoint = c.consumedSkillPoint, w.setConsumePointToSkillList(d.skill_id, c.consumedSkillPoint), w.setSkillListTypeStatus(d.skill_id, ""))
            }

            function d(a, b) {
                var c = nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr(a),
                    d = nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr(b);
                c && d && d.skillType != nc.bns.training.Model.SKILL_TYPE_NONE && (d.consumedSkillPoint = c.consumedSkillPoint, w.setConsumePointToSkillList(d.skill_id, c.consumedSkillPoint), w.setSkillListTypeStatus(d.skill_id, ""))
            }

            function e(a, b, c, d) {
                var e = nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr(a),
                    g = nc.bns.training.util.SearchDataUtil.getVariationObjHasVariationIdAndAlias(a, b, c);
                e.name2_refine = d, e.initJamoStr = nc.bns.training.util.StringUtil.getInitialJamoStr(d.charAt(0), nc.bns.training.Model.SORT_NAME_ARR), e.learnedSkillVariationId = g.variation_id, e.learnedSkillTooltipAlias = g.tooltip_alias, e.learnedSkillAlias = g.alias;
                var h = "";
                e.skill_icon && (h = nc.bns.training.Model.SKILL_IMG_URL_FRONT + e.skill_icon[String(b)]), f(), v = i(u), w.sortListBySortOptionIndex(v, u), w.setSkillListThumbnail(a, h), w.activateSkillListBySkillIdByExternal(a)
            }

            function f() {
                t = nc.bns.training.Model.CUSTOM_CATEGORY_OBJ_ARR, o = j(t), p = k(o), q = l(t), r = m(q)
            }

            function g(b) {
                switch (b.preventDefault(), b.stopPropagation(), b.type) {
                case nc.bns.training.category.CategoryContainer.SELECT_SKILL_LIST:
                    var c = b.skillId;
                    a(n).trigger({
                        type: nc.bns.training.category.Contents.TRIGGER_SELECT_SKILL_LIST,
                        skillId: c
                    })
                }
            }

            function h(b) {
                switch (b.preventDefault(), b.stopPropagation(), b.type) {
                case nc.bns.training.category.SortMenu.CLICK_SORT_MENU:
                    var c = parseInt(b.index);
                    if (u == c) return;
                    v = i(c), w.sortListBySortOptionIndex(v, c), x.activateMenu(c), u = c, a(n).trigger({
                        type: nc.bns.training.category.Contents.TRIGGER_SELECT_SORT_MENU,
                        sortOptionIndex: u
                    })
                }
            }

            function i(a) {
                var b = null;
                switch (a) {
                case 1:
                    b = p;
                    break;
                case 2:
                    b = r
                }
                return b
            }

            function j(a) {
                var b = a;
                return b.sort(function (a, b) {
                    return parseInt(b.sort_no) - parseInt(a.sort_no)
                }), b.sort(function (a, b) {
                    return parseInt(a.skill_id) - parseInt(b.skill_id)
                }), b
            }

            function k(a) {
                for (var b, c = [], d = 0, e = nc.bns.training.Model.SORT_INPUT_ARR.length; e > d; d++) b = [], b.default_keycap = nc.bns.training.Model.SORT_INPUT_ARR[d], c.push(b);
                for (var f, g, h, i, j = a, k = 0, l = j.length; l > k; k++) {
                    f = j[k];
                    for (var m = 0, n = c.length; n > m; m++) {
                        b = c[m], g = f.default_keycap, h = g.split(",");
                        for (var o = 0, p = h.length; p > o; o++)
                            if (i = nc.bns.training.util.StringUtil.trim(h[o]), i == b.default_keycap) {
                                f.default_keycap = i, b.push(f);
                                break
                            }
                    }
                }
                return c
            }

            function l(a) {
                var b = a;
                return b.sort(function (a, b) {
                    return parseInt(a.pc_level) - parseInt(b.pc_level)
                }), b.sort(function (a, b) {
                    return parseInt(a.skill_id) - parseInt(b.skill_id)
                }), b
            }

            function m(a) {
                for (var b, c = [], d = 0, e = nc.bns.training.Model.SORT_LEVEL_ARR.length; e > d; d++) b = [], b.pc_level = nc.bns.training.Model.SORT_LEVEL_ARR[d], c.push(b);
                for (var f, g = a, h = 0, i = g.length; i > h; h++) {
                    f = g[h];
                    for (var j = 0, k = c.length; k > j; j++)
                        if (b = c[j], parseInt(f.pc_level) <= parseInt(b.pc_level)) {
                            b.push(f);
                            break
                        }
                }
                return c
            }
            var n = this;
            n.destroy = function () {
                a(s).empty(), w && (a(w).unbind(nc.bns.training.category.CategoryContainer.SELECT_SKILL_LIST, g), w.destroy(), w = null), x && (a(x).unbind(nc.bns.training.category.SortMenu.CLICK_SORT_MENU, h), x.destroy(), x = null)
            }, n.reset = function () {
                f(), v = i(u), w.sortListBySortOptionIndex(v, u)
            }, n.setCategoryContainerPosY = function (a) {
                w && w.setContainerPosYByExternal(a)
            }, n.getSkillIdOfFirstSkillList = function () {
                var a = i(u),
                    b = a[0],
                    c = b[0];
                return String(c.skill_id)
            }, n.sortListBySortOptionIndexByExternal = function () {
                v = i(u), w.sortListBySortOptionIndex(v, u)
            }, n.setSkillListsStatusByExternal = function (a) {
                function b(a, b) {
                    var c, d, f, h, i = "",
                        j = !1;
                    for (var k in nc.bns.training.Model.SLOT_OBJ_JSON) {
                        d = nc.bns.training.Model.SLOT_OBJ_JSON[k];
                        for (var m in d) {
                            f = d[m];
                            for (var n in f)
                                if (h = f[n], h.skill_id == a && h.variation_id == b && (i = h.tree_id, c = h, j = !0), j) break;
                            if (j) break
                        }
                        if (j) break
                    }
                    if (c) {
                        var o = nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr(i),
                            p = nc.bns.training.Model.SLOT_OBJ_JSON[i];
                        if (o) {
                            o.learnedSkillVariationId = c.variation_id, o.learnedSkillAlias = c.alias, o.learnedSkillTooltipAlias = c.tooltip_alias;
                            var q = null;
                            e.setPrevTrainVariationObj(e, p, c, q), q && o.name2_refine != q.name2_refine && (o.name2_refine = q.name2_refine, o.initJamostr = nc.bns.training.util.StringUtil.getInitialJamoStr(l.name2_refine.charAt(0), nc.bns.training.Model.SORT_NAME_ARR)), o.consumedSkillPoint = nc.bns.training.util.SearchDataUtil.getConsumedSkillPoint(p, g, c.alias)
                        }
                    }
                }
                if (a) {
                    var e = {};
                    e.setPrevTrainVariationObj = function (a, b, c, d) {
                        var f = !1,
                            g = null,
                            h = c.prev_train[0];
                        h ? (g = nc.bns.training.util.SearchDataUtil.getVariationObjFromSkillSlotDataByAlias(b, h), g.tree_id != g.skill_id ? f = !1 : (f = !0, d = g)) : (g = c, g.tree_id != g.skill_id ? (f = !0, d = null) : (f = !0, d = g)), f || e.setPrevTrainVariationObj(a, b, g, d)
                    };
                    var g, h, j, k, l, m = [],
                        n = [];
                    for (var o in a)
                        if (nc.bns.training.util.CheckUtil.available(nc.bns.training.Model.SLOT_OBJ_JSON[o])) g = a[o], h = nc.bns.training.util.SearchDataUtil.getVariationObjHasVariationId(o, g), j = {}, j.skillId = String(o), j.learnedSkillVariationId = String(g), j.learnedSkillAlias = h.alias, j.learnedSkillTooltipAlias = h.tooltip_alias, j.name2_refine = h.name2_refine, j.consumedSkillPoint = nc.bns.training.util.SearchDataUtil.getConsumedSkillPoint(nc.bns.training.Model.SLOT_OBJ_JSON[o], g, h.alias), m.push(j);
                        else if (g = a[o], k = nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr(o)) switch (k.skillType) {
                    case nc.bns.training.Model.SKILL_TYPE_ACQUISITION:
                        l = nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr(k.tree_id);
                        var p, q, r = nc.bns.training.Model.SLOT_OBJ_JSON[String(k.tree_id)],
                            s = !1;
                        for (var t in r) {
                            p = r[t];
                            for (var x in p)
                                if (q = p[x], q.skill_id == k.skill_id && q.variation_id == g) {
                                    s = !0;
                                    break
                                }
                            if (s) break
                        }
                        if (s) {
                            n.push(q), l.learnedSkillVariationId = q.variation_id, l.learnedSkillAlias = q.alias, l.learnedSkillTooltipAlias = q.tooltip_alias;
                            var y = null;
                            e.setPrevTrainVariationObj(e, r, q, y), y && l.name2_refine != y.name2_refine && (l.name2_refine = y.name2_refine, l.initJamostr = nc.bns.training.util.StringUtil.getInitialJamoStr(l.name2_refine.charAt(0), nc.bns.training.Model.SORT_NAME_ARR)), l.consumedSkillPoint = nc.bns.training.util.SearchDataUtil.getConsumedSkillPoint(r, g, q.alias)
                        }
                        break;
                    case nc.bns.training.Model.SKILL_TYPE_NONE:
                        b(o, g)
                    } else b(o, g);
                    for (var z, A, B = [], C = 0, D = m.length; D > C; C++) {
                        z = m[C];
                        for (var E = 0, F = nc.bns.training.Model.CUSTOM_CATEGORY_OBJ_ARR.length; F > E; E++) A = nc.bns.training.Model.CUSTOM_CATEGORY_OBJ_ARR[E], A.skill_id == z.skillId && (A.skill_id = z.skillId, A.learnedSkillVariationId = z.learnedSkillVariationId, A.learnedSkillAlias = z.learnedSkillAlias, A.learnedSkillTooltipAlias = z.learnedSkillTooltipAlias, A.name2_refine = z.name2_refine, A.initJamoStr = nc.bns.training.util.StringUtil.getInitialJamoStr(z.name2_refine.charAt(0), nc.bns.training.Model.SORT_NAME_ARR), A.consumedSkillPoint = z.consumedSkillPoint, B.push(A))
                    }
                    if (w) {
                        f(), v = i(u), w.sortListBySortOptionIndex(v, u);
                        for (var G, H, I = nc.bns.training.util.SearchDataUtil.getShareSkillListObjArrFromCustomGlobalModelArr(), J = 0, K = m.length; K > J; J++) {
                            G = m[J];
                            for (var L = 0, M = I.length; M > L; L++) H = I[L], H.tree_id == G.skillId && c(G.skillId, H.skill_id)
                        }
                        for (var N, O, P, Q, R = 0, S = n.length; S > R; R++) {
                            N = n[R], Q = N.tree_id, O = nc.bns.training.util.SearchDataUtil.getPrevTrainedAllSkillId(nc.bns.training.Model.SLOT_OBJ_JSON[N.tree_id], N.alias);
                            for (var T = 0, U = O.length; U > T; T++) P = O[T], P != Q && d(Q, P)
                        }
                        for (var V, W, X, Y, Z = 0, $ = B.length; $ > Z; Z++) {
                            V = B[Z], W = nc.bns.training.util.SearchDataUtil.getVariationObjHasVariationIdAndAlias(V.skill_id, V.learnedSkillVariationId, V.learnedSkillAlias), X = nc.bns.training.util.SearchDataUtil.getPrevTrainedAllSkillId(nc.bns.training.Model.SLOT_OBJ_JSON[W.tree_id], W.alias);
                            for (var _ = 0, ab = X.length; ab > _; _++) Y = X[_], Y != V.tree_id && d(V.tree_id, Y)
                        }
                        w.activateSkillListBySkillIdByExternal(nc.bns.training.Model.lastSelectedSkillListSkillId)
                    }
                }
            }, n.setTreeSkillListStatusToShareSkillListByExternal = function (a, b) {
                c(a, b)
            }, n.setTreeSkillListStatusToAcquisitionSkillListByExternal = function (a, b) {
                d(a, b)
            }, n.consumePointToSkillListInCategoryContainer = function (a, b) {
                var c = nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr(a);
                c && (c.consumedSkillPoint += b, w.setConsumePointToSkillList(a, c.consumedSkillPoint))
            }, n.replaceNormalSkillListThumbInCategoryContainer = function (a, b) {
                var c = nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr(a),
                    d = "";
                c.skill_icon && (d = nc.bns.training.Model.SKILL_IMG_URL_FRONT + c.skill_icon[String(b)]), w.setSkillListThumbnail(a, d)
            }, n.activateCategorySkillListBySkillId = function (a) {
                w.activateSkillListBySkillIdByExternal(a)
            }, n.replaceSkillListInCategoryContainer = function (a, b, c, d) {
                e(a, b, c, d)
            }, n.getSkillListPosYInCategoryContainer = function (a) {
                var b = w.getSkillListPosYByExternal(a);
                return b
            };
            var o, p, q, r, s = b.container,
                t = b.objArr,
                u = b.sortOptionIndex,
                v = null,
                w = null,
                x = null;
            a(s).empty(), f(), v = i(u);
            var y = '<div class="bgt"></div>',
                z = '<div class="categoryBody"><div class="scrollCategoryBody"></div></div>',
                A = '<div class="bgb"></div>',
                B = '<div class="menuWrap">';
            return a(s).append( z + B), w = new nc.bns.training.category.CategoryContainer({
                containerWrap: a(".categoryBody", s).get(0),
                container: a(".categoryBody .scrollCategoryBody", s).get(0),
                skillObjArr: t,
                sortedListArr: v,
                sortOptionIndex: u
            }), a(w).bind(nc.bns.training.category.CategoryContainer.SELECT_SKILL_LIST, g), x = new nc.bns.training.category.SortMenu({
                container: a(".menuWrap", s).get(0)
            }), a(x).bind(nc.bns.training.category.SortMenu.CLICK_SORT_MENU, h), x.activateMenu(u), n
        }, nc.bns.training.category.Contents.TRIGGER_SELECT_SKILL_LIST = "TRIGGER_SELECT_SKILL_LIST", nc.bns.training.category.Contents.TRIGGER_SELECT_SORT_MENU = "TRIGGER_SELECT_SORT_MENU", nc.bns.training.category.SortMenu = function (b) {
            function c(b) {
                switch (b.preventDefault(), b.type) {
                case "click":
                    var c = b.currentTarget;
                    a(e).trigger({
                        type: nc.bns.training.category.SortMenu.CLICK_SORT_MENU,
                        index: c.index
                    })
                }
            }

            function d(b) {
                for (var c, d = 0, e = j.length; e > d; d++) c = j[d], c.index != b ? a(c).removeClass("selected") : a(c).addClass("selected")
            }
            var e = this;
            e.destroy = function () {
                if (j)
                    for (var b, d = 0, e = j.length; e > d; d++) b = j[d], a(b).unbind("click", c)
            }, e.getContainer = function () {
                return f
            }, e.activateMenu = function (a) {
                d(a)
            };
            var f = b.container,
                g = '<span class="sorting_cmdkey">발동키순</span>',
                h = '<span class="sorting_level">레벨순</span>';
            a(f).append(g + h);
            for (var i, j = a("span", f), k = 0, l = j.length; l > k; k++) i = j[k], i.index = k + 1, a(i).bind("click", c);
            return e
        }, nc.bns.training.category.SortMenu.CLICK_SORT_MENU = "CLICK_SORT_MENU", nc.bns.training.category.CategoryContainer = function (b) {
            function c() {
                r && (r.style.position = ""), d(), k(0), i()
            }

            function d() {
                function b(a, b) {
                    var c = a.skill_icon[b];
                    if (c) return c;
                    c = "";
                    for (var d, e, f = a.tree_id, g = nc.bns.training.util.SearchDataUtil.getVariationObjHasVariationId(f, b), h = nc.bns.training.util.SearchDataUtil.getPrevTrainedSkillVariationObjs(nc.bns.training.Model.SLOT_OBJ_JSON[f], g.alias), i = 0, j = h.length; j > i; i++)
                        if (d = h[i], e = nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr(d.skill_id)) switch (e.skillType) {
                        case "":
                            return c = a.skill_icon[d.variation_id] ? a.skill_icon[d.variation_id] : a.skill_icon[1] ? a.skill_icon[1] : "";
                        case nc.bns.training.Model.SKILL_TYPE_ACQUISITION:
                        }
                    return c || (c = a.skill_icon[1] ? a.skill_icon[1] : ""), c
                }

                function c(a, b) {
                    for (var c, d, e = "", f = a.tree_id, g = nc.bns.training.util.SearchDataUtil.getVariationObjHasVariationId(f, b), h = nc.bns.training.util.SearchDataUtil.getPrevTrainedSkillVariationObjs(nc.bns.training.Model.SLOT_OBJ_JSON[f], g.alias), i = 0, j = h.length; j > i; i++)
                        if (c = h[i], d = nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr(c.skill_id)) switch (d.skillType) {
                        case "":
                            return e = c.name2_refine;
                        case nc.bns.training.Model.SKILL_TYPE_ACQUISITION:
                        }
                    if ("" === e) {
                        var k = nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr(f);
                        k && (e = k.initName2Refine)
                    }
                    return e
                }
                u = l(t);
                for (var d, e, g, h, i, j, k, m, n, o, p = [], q = 0, w = s.length; w > q; q++)
                    if (h = s[q], h && h.length > 0) {
                        switch (i = document.createElement("dl"), a(i).addClass = "category_type", a(r).append(i), u) {
                        case "default_keycap":
                            d = nc.bns.training.Model.SORT_INPUT_OBJ[h[u]].category;
                            break;
                        case "pc_level":
                            d = h[u]
                        }
                        g = "<dt><strong>" + d + "</strong></dt><dd><ul></ul></dd>", a(i).append(g);
                        for (var x = 0, y = h.length; y > x; x++) {
                            if (m = h[x], j = a("ul", i).get(0), k = document.createElement("li"), k.data = m, k.skill_id = m.skill_id, a(j).append(k), o = "", m.skill_icon) {
                                var z = "";
                                if ("" !== m.learnedSkillVariationId) {
                                    var A = b(m, m.learnedSkillVariationId);
                                    z = A
                                } else z = m.skill_icon[1] ? m.skill_icon[1] : "";
                                o = nc.bns.training.Model.SKILL_IMG_URL_FRONT + z
                            }
                            if ("" !== m.learnedSkillVariationId && (m.name2_refine = c(m, m.learnedSkillVariationId)), e = nc.bns.training.Model.SORT_INPUT_OBJ[m.default_keycap].value, n = '<span class="thumb"><img src="' + o + '"></span><em class="name">' + m.name2_refine + '</em><span class="cmdkey">' + e + '</span><span class="frame"></span><span class="point"></span>', a(k).append(n), "" !== e && a(".cmdkey", k).addClass("key_" + e), nc.bns.training.Model.level < m.pc_level) a(k).addClass("lock");
                            else if (m.disable == nc.bns.training.Model.NO_DISABLE);
                            else if (m.disable == nc.bns.training.Model.SKILL_TYPE_HIDDEN) {
                                a(k).addClass("hide");
                            } else switch (m.skillType) {
                            case "":
                                break;
                            case nc.bns.training.Model.SKILL_TYPE_NONE:
                                a("em.name", k).addClass("single");
                                break;
                            case nc.bns.training.Model.SKILL_TYPE_ACQUISITION:
                                a(k).addClass("disable");
                                break;
                            case nc.bns.training.Model.SKILL_TYPE_SHARE:
                            }
                            parseInt(m.consumedSkillPoint) > 0 && p.push(m)
                        }
                    }
                var B = a("li", r);
                v = [];
                for (var C, D = 0, E = B.length; E > D; D++) C = new nc.bns.training.category.CategorySkillList({
                    container: B[D],
                    data: B[D].data
                }), a(C).bind(nc.bns.training.category.CategorySkillList.CLICK_CATEGORY_SKILL_LIST, f), v.push(C);
                for (var F, G, H = 0, I = p.length; I > H; H++) {
                    F = p[H];
                    for (var J = 0, K = v.length; K > J; J++)
                        if (G = v[J], G.getSkillId() == F.skill_id) switch (G.setDisplayConsumedSkillPoint(parseInt(F.consumedSkillPoint)), F.skillType) {
                        case "":
                            break;
                        case nc.bns.training.Model.SKILL_TYPE_ACQUISITION:
                            G.setTypeStatus(F.consumedSkillPoint > 0 ? "" : nc.bns.training.Model.SKILL_TYPE_ACQUISITION);
                            break;
                        case nc.bns.training.Model.SKILL_TYPE_SHARE:
                        }
                }
            }

            function e(a, b) {
                var c = o(a);
                c && c.setTypeStatus(b)
            }

            function f(b) {
                switch (b.preventDefault(), b.stopPropagation(), b.type) {
                case nc.bns.training.category.CategorySkillList.CLICK_CATEGORY_SKILL_LIST:
                    h(b.target);
                    var c = b.skillId;
                    a(p).trigger({
                        type: nc.bns.training.category.CategoryContainer.SELECT_SKILL_LIST,
                        skillId: c
                    })
                }
            }

            function g(a) {
                for (var b, c = 0, d = v.length; d > c; c++) b = v[c], b.getSkillId() != a ? b.deactivate() : b.activate()
            }

            function h(a) {
                for (var b, c = 0, d = v.length; d > c; c++) b = v[c], b.getContainer() != a ? b.deactivate() : b.activate()
            }

            function i() {
                a(r).unbind("mousewheel DOMMouseScroll", j), a(r).bind("mousewheel DOMMouseScroll", j)
            }

            function j(b) {
                switch (b.type) {
                case "mousewheel":
                case "DOMMouseScroll":
                }
            }

            function k(b) {}

            function l(a) {
                var b = "";
                switch (a) {
                case 1:
                    b = "default_keycap";
                    break;
                case 2:
                    b = "pc_level"
                }
                return b
            }

            function m(a, b) {
                var c = o(a);
                c && c.setDisplayConsumedSkillPoint(b)
            }

            function n(a, b) {
                var c = o(a);
                c && c.setThumbnail(b)
            }

            function o(a) {
                for (var b = null, c = 0, d = v.length; d > c && (b = v[c], a != b.getSkillId()); c++);
                return b
            }
            var p = this;
            p.destroy = function () {
                if (v) {
                    for (var b, c = 0, d = v.length; d > c; c++) b = v[c], a(b).bind(nc.bns.training.category.CategorySkillList.CLICK_CATEGORY_SKILL_LIST, f);
                    v = null
                }
            }, p.activateSkillListBySkillIdByExternal = function (a) {
                g(a)
            }, p.getSkillListPosYByExternal = function (b) {
                for (var c, d = 0, e = !1, f = 0, g = v.length; g > f; f++)
                    if (c = v[f], c.getSkillId() == b) {
                        e = !0;
                        break
                    }
                if (e) {
                    for (var h, i = c.getContainer(), j = a("> dl", r), k = !1, l = 0, m = j.length; m > l; l++)
                        if (h = j[l], a(h).has(i)) {
                            k = !0;
                            break
                        }
                    if (k) {
                        var n = a(h).position().top;
                        d = n + a(i).position().top
                    }
                }
                return d
            }, p.sortListBySortOptionIndex = function (b, c) {
                a(r).empty(), s = b, t = c, d(), k(0), i()
            }, p.setSkillListThumbnail = function (a, b) {
                n(a, b)
            }, p.setConsumePointToSkillList = function (a, b) {
                m(a, b)
            }, p.setSkillListTypeStatus = function (a, b) {
                e(a, b)
            }, p.setContainerPosYByExternal = function (b) {
                var c = parseInt(a(q).height()),
                    d = parseInt(a(r).height()),
                    e = c - d;
                e > b && (b = e), k(b)
            };
            var q = b.containerWrap,
                r = b.container,
                s = (b.skillObjArr, b.sortedListArr),
                t = b.sortOptionIndex,
                u = "",
                v = [];
            return c(), p
        }, nc.bns.training.category.CategoryContainer.SELECT_SKILL_LIST = "SELECT_SKILL_LIST", nc.bns.training.category.CategorySkillList = function (b) {
            function c() {
                f = a(".point", g), a(g).bind("click", d)
            }

            function d(b) {
                switch (b.preventDefault(), b.type) {
                case "click":
                    a(e).trigger({
                        type: nc.bns.training.category.CategorySkillList.CLICK_CATEGORY_SKILL_LIST,
                        target: g,
                        skillId: i
                    })
                }
            }
            var e = this;
            e.getContainer = function () {
                return g
            }, e.activate = function () {
                current = i;
                a(g).addClass("selected")
            }, e.deactivate = function () {
                a(g).removeClass("selected")
            }, e.getConsumedSkillPoint = function () {
                return j
            }, e.getSkillId = function () {
                return i
            }, e.setTypeStatus = function (b) {
                var c = !1;
                if (a(g).hasClass("lock") && (c = !0), !c) switch (a(g).removeClass(), b) {
                case "":
                    break;
                case nc.bns.training.Model.SKILL_TYPE_ACQUISITION:
                    a(g).addClass("disable");
                    break;
                case nc.bns.training.Model.SKILL_TYPE_SHARE:
                }
            }, e.setDisplayConsumedSkillPoint = function (a) {
                0 >= a ? f.removeClass("point_able") : (f.addClass("point_able"), f.text(String(a))), j = a
            }, e.setThumbnail = function (b) {
                var c = b ? b : "",
                    d = a(".thumb > img", g).get(0);
                d && d.src !== b && (d.src = c)
            };
            var f, g = b.container,
                h = b.data,
                i = h.skill_id,
                j = 0;
            return c(), e
        }, nc.bns.training.category.CategorySkillList.CLICK_CATEGORY_SKILL_LIST = "CLICK_CATEGORY_SKILL_LIST"
    }(jQuery);
var nc;
nc || (nc = {}), nc.bns || (nc.bns = {}), nc.bns.training || (nc.bns.training = {}),
    function ($) {
        nc.bns.training.util = {}, nc.bns.training.util.StringUtil = {
            trim: function (a) {
                return a.replace(/^\s+/, "").replace(/\s+$/, "")
            },
            getFixedPostPositionStr: function (a, b) {
                function c(a, b) {
                    return "을" == a || "를" == a ? b ? "을" : "를" : "이" == a || "가" == a ? b ? "이" : "가" : "은" == a || "는" == a ? b ? "은" : "는" : "과" == a || "와" == a ? b ? "과" : "와" : a
                }
                if (a.length <= 0) return "";
                if (b.length <= 0) return "";
                var d = a.charCodeAt(a.length - 1);
                return 44032 > d || d > 55203 ? b : (d - 44032) % 28 !== 0 ? c(b, !0) : c(b, !1)
            },
            getInitialJamoStr: function (a, b) {
                var c, d = a.charCodeAt();
                return d >= 44032 && 55203 >= d ? (c = Math.floor((d - 44032) / 588), c = String(b[c])) : c = d >= 32 && 126 >= d ? 32 == d ? " " : String.fromCharCode(92 == d ? d : d) : String.fromCharCode(d), c
            }
        }, nc.bns.training.util.ArrayUtil = {
            indexOf: function (a, b) {
                for (var c = 0, d = a.length; d > c; c++)
                    if (a[c] === b) return c;
                return -1
            },
            getElement: function (a, b) {
                for (var c = 0, d = a.length; d > c; c++)
                    if (a[c] === b) return b;
                return null
            },
            getMaxNumberByArr: function (a) {
                return a.sort(function (a, b) {
                    return a - b
                }), a[a.length - 1]
            },
            removeElement: function (a, b) {
                var c = nc.bns.training.util.ArrayUtil.indexOf(a, b);
                c >= 0 && a.splice(c, 1)
            }
        }, nc.bns.training.util.ObjectUtil = {
            getSize: function (a) {
                var b, c = 0;
                for (b in a) a.hasOwnProperty(b) && c++;
                return c
            },
            getElementKeyNameArr: function (a) {
                var b, c = [];
                for (b in a) a.hasOwnProperty(b) && c.push(b);
                return c
            },
            getElementArr: function (a) {
                var b, c = [];
                for (b in a) a.hasOwnProperty(b) && c.push(a[b]);
                return c
            },
            getAccumulatedNumberVal: function (a, b) {
                if (!b) return null;
                if (void 0 === a[b]) return 0;
                var c, d = 0;
                for (c in a)
                    if (a.hasOwnProperty(c)) {
                        var e = a[c];
                        if ("number" != typeof e) return null;
                        if (d += e, c === b) return d
                    }
                return d
            }
        }, nc.bns.training.util.CheckUtil = {
            available: function (a) {
                var b = !0;
                return null == a || void 0 == a ? !1 : b
            }
        }, nc.bns.training.util.SearchDataUtil = {
            getConsumedSkillPoint: function (a, b, c) {
                var d = 0,
                    e = [],
                    f = "",
                    g = {};
                g.makeConsumedPointArr = function (d, g) {
                    var h, i, j = !1,
                        k = !1;
                    for (var l in a) {
                        h = a[l];
                        for (var m in h)
                            if (i = h[m], g) {
                                if (i.alias == f) {
                                    f = i.prev_train[0];
                                    var n = 0;
                                    if (parseInt(i.max_variation_level) > 1) {
                                        for (var o in h)
                                            if (n += parseInt(h[o].required_tp), parseInt(o) === parseInt(i.max_variation_level)) {
                                                e.unshift(n);
                                                break
                                            }
                                    } else e.unshift(parseInt(i.required_tp));
                                    k = !0, j = !0;
                                    break
                                }
                            } else if (i.variation_id == b) {
                            if (i.alias == c) {
                                f = i.prev_train[0];
                                var n = 0;
                                if (parseInt(i.max_variation_level) > 1) {
                                    for (var o in h)
                                        if (n += parseInt(h[o].required_tp), parseInt(o) === parseInt(m)) {
                                            e.unshift(n);
                                            break
                                        }
                                } else e.unshift(parseInt(i.required_tp));
                                k = !0, j = !0
                            }
                            break
                        }
                        if (j) break
                    }
                    k && d.makeConsumedPointArr(d, !0)
                }, g.makeConsumedPointArr(g, !1);
                for (var h, i = 0, j = e.length; j > i; i++) h = parseInt(e[i]), 0 == h && (h = 1), d += h;
                return d
            },
            get1stVaridationObjHasTooltipAlias: function (a, b, c) {
                var d, e, f = null,
                    g = nc.bns.training.Model.SLOT_OBJ_JSON[String(a)],
                    h = !1;
                for (var i in g) {
                    d = g[i];
                    for (var j in d) e = d[j], e.skill_id == b && e.tooltip_alias == c && (h = !0, f = e);
                    if (h) break
                }
                return f
            },
            getVariationObjHasVariationId: function (a, b) {
                var c, d, e = null,
                    f = nc.bns.training.Model.SLOT_OBJ_JSON[String(a)],
                    g = !1;
                for (var h in f) {
                    c = f[h];
                    for (var i in c) d = c[i], d.variation_id == b && (g = !0, e = d);
                    if (g) break
                }
                return e
            },
            getVariationObjHasVariationIdAndAlias: function (a, b, c) {
                var d, e, f = null,
                    g = nc.bns.training.Model.SLOT_OBJ_JSON[String(a)],
                    h = !1;
                for (var i in g) {
                    d = g[i];
                    for (var j in d) e = d[j], e.variation_id == b && e.alias == c && (h = !0, f = e);
                    if (h) break
                }
                return f
            },
            getCustomVariationObjHasSkillIdAndVariationId: function (a, b, c) {
                var d, e, f = null,
                    g = nc.bns.training.Model.SLOT_OBJ_JSON[String(a)],
                    h = !1;
                for (var i in g) {
                    d = g[i];
                    for (var j in d)
                        if (e = d[j], e.skill_id == b && e.variation_id == c) {
                            h = !0, f = {
                                slotNo: i,
                                tree_id: e.tree_id,
                                skill_id: b,
                                alias: e.alias,
                                variation_id: c
                            };
                            break
                        }
                    if (h) break
                }
                return f
            }
        }, nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr = function (a) {
            for (var b = !1, c = null, d = 0, e = nc.bns.training.Model.CUSTOM_CATEGORY_OBJ_ARR.length; e > d; d++)
                if (c = nc.bns.training.Model.CUSTOM_CATEGORY_OBJ_ARR[d], String(c.skill_id) == a) {
                    b = !0;
                    break
                }
            return b ? c : null
        }, nc.bns.training.util.SearchDataUtil.getAcquisitionSkillListObjFromCustomGlobalModelArrByTreeId = function (a) {
            for (var b, c = [], d = 0, e = nc.bns.training.Model.CUSTOM_CATEGORY_OBJ_ARR.length; e > d; d++) b = nc.bns.training.Model.CUSTOM_CATEGORY_OBJ_ARR[d], b.skillType == nc.bns.training.Model.SKILL_TYPE_ACQUISITION && b.tree_id == a && b.tree_id != b.skill_id && c.push(b);
            return c
        }, nc.bns.training.util.SearchDataUtil.getShareSkillListObjFromCustomGlobalModelArrByTreeId = function (a) {
            for (var b, c = [], d = 0, e = nc.bns.training.Model.CUSTOM_CATEGORY_OBJ_ARR.length; e > d; d++) b = nc.bns.training.Model.CUSTOM_CATEGORY_OBJ_ARR[d], b.skillType == nc.bns.training.Model.SKILL_TYPE_SHARE && b.tree_id == a && b.tree_id != b.skill_id && c.push(b);
            return c
        }, nc.bns.training.util.SearchDataUtil.getShareSkillListObjArrFromCustomGlobalModelArr = function () {
            for (var a, b = [], c = 0, d = nc.bns.training.Model.CUSTOM_CATEGORY_OBJ_ARR.length; d > c; c++) a = nc.bns.training.Model.CUSTOM_CATEGORY_OBJ_ARR[c], a.skillType == nc.bns.training.Model.SKILL_TYPE_SHARE && b.push(a);
            return b
        }, nc.bns.training.util.SearchDataUtil.getVariationObjFromSkillSlotDataByAlias = function (a, b) {
            var c, d, e = !1;
            for (var f in a) {
                c = a[f];
                for (var g in c)
                    if (d = c[g], d.alias == b) {
                        e = !0;
                        break
                    }
                if (e) break
            }
            return e ? d : null
        }, nc.bns.training.util.SearchDataUtil.getPrevTrainedAllSkillId = function (a, b) {
            var c = [],
                d = {};
            return d.makeTrainSkillIdArr = function (d, e) {
                var f, g, h, i = !1,
                    j = !1;
                for (var k in a) {
                    f = a[k];
                    for (var l in f)
                        if (g = f[l], e) {
                            if (g.alias == prevTrainAliasStr) {
                                prevTrainAliasStr = g.prev_train[0];
                                for (var m in g.train_skill_id) h = g.train_skill_id[m], h && c.push(h);
                                j = !0, i = !0;
                                break
                            }
                        } else if (g.alias == b) {
                        prevTrainAliasStr = g.prev_train[0];
                        for (var m in g.train_skill_id) h = g.train_skill_id[m], h && c.push(h);
                        j = !0, i = !0;
                        break
                    }
                    if (i) break
                }
                j && d.makeTrainSkillIdArr(d, !0)
            }, d.makeTrainSkillIdArr(d, !1), c
        }, nc.bns.training.util.SearchDataUtil.getPrevTrainedSkillVariationObjs = function (a, b) {
            var c = [],
                d = {};
            return d.makeTrainSkillVariationObjArr = function (d, e) {
                var f, g, h = !1,
                    i = !1;
                for (var j in a) {
                    f = a[j];
                    for (var k in f)
                        if (g = f[k], e) {
                            if (g.alias == prevTrainAliasStr) {
                                prevTrainAliasStr = g.prev_train[0], c.push(g), i = !0, h = !0;
                                break
                            }
                        } else if (g.alias == b) {
                        prevTrainAliasStr = g.prev_train[0], c.push(g), i = !0, h = !0;
                        break
                    }
                    if (h) break
                }
                i && d.makeTrainSkillVariationObjArr(d, !0)
            }, d.makeTrainSkillVariationObjArr(d, !1), c
        }, nc.bns.training.util.SearchDataUtil.getPrevTrainedAllSkillVariationObjs = function (a, b) {
            var c = [],
                d = {};
            return d.makeTrainSkillVariationObjArr = function (d, e) {
                var f, g, h = !1,
                    i = !1;
                for (var j in a) {
                    f = a[j];
                    var k = 0;
                    for (var l in f)
                        if (g = f[l], k++, e) {
                            if (g.alias == prevTrainAliasStr) {
                                prevTrainAliasStr = g.prev_train[0];
                                var m = [];
                                for (var n in f) m.push(f[n]);
                                for (var o = m.length - 1; o >= 0; o--) c.unshift(m[o]);
                                i = !0, h = !0;
                                break
                            }
                        } else if (g.tooltip_alias == b) {
                        if (prevTrainAliasStr = g.prev_train[0], k > 1) {
                            var m = [];
                            for (var n in f)
                                if (m.push(f[n]), n == l) {
                                    for (var o = m.length - 1; o >= 0; o--) c.unshift(m[o]);
                                    break
                                }
                        } else c.unshift(g);
                        i = !0, h = !0;
                        break
                    }
                    if (h) break
                }
                i && d.makeTrainSkillVariationObjArr(d, !0)
            }, d.makeTrainSkillVariationObjArr(d, !1), c
        }, nc.bns.training.tree = {}, nc.bns.training.tooltip = {}, nc.bns.training.Training = function (_options) {
            function init($flag_initializeFirst, $jsonObj) {
                function getFlagNoTrainingSkill() {
                    if ("1" == _tmpObj.tree_id) return !0;
                    if (_tmpObj.tree_id == _tmpObj.skill_id) {
                        var a = nc.bns.training.Model.SLOT_OBJ_JSON[_tmpObj.skill_id];
                        if (!a) return !0
                    }
                    return !1
                }

                function bindMasterySelectLevelInteraction(a) {
                    a ? ($(_selectMasteryLevel).unbind(nc.bns.training.select.SelectMasteryLevel.SELECT_MASTERY_LEVEL, selectMasteryLevelEventHandler), $(_selectMasteryLevel).bind(nc.bns.training.select.SelectMasteryLevel.SELECT_MASTERY_LEVEL, selectMasteryLevelEventHandler)) : $(_selectMasteryLevel).unbind(nc.bns.training.select.SelectMasteryLevel.SELECT_MASTERY_LEVEL, selectMasteryLevelEventHandler)
                }

                function selectLevelEventHandler(a) {
                    switch (a.preventDefault(), a.stopPropagation(), a.type) {
                    case nc.bns.training.select.SelectLevel.SELECT_LEVEL:
                        var b = a.level;
                        if (b == nc.bns.training.Model.level) return;
                        if (b < nc.bns.training.Model.level) {
                            var c = {
                                character_level: b,
                                character_mastery_level: 0,
                                character_job: nc.bns.training.Model.job,
                                json_slot_data: {}
                            };
                            b < nc.bns.training.Model.MIN_LEVEL_CAN_USE_MASTERY_LEVEL ? resettingByJsonDataObj(c) : b >= nc.bns.training.Model.LEVEL_SWITCH_MASTERY_LEVEL_RANGE && (resettingByJsonDataObj(c), _selectMasteryLevel.switchMasteryLevelLange(parseInt(nc.bns.training.Model.MASTERY_LEVEL_RANGE_BY_LEVEL_OBJ[String(nc.bns.training.Model.LEVEL_SWITCH_MASTERY_LEVEL_RANGE)])), _selectMasteryLevel.displayMasteryLevel(nc.bns.training.Model.masteryLevel))
                        } else {
                            var d, e = nc.bns.training.Model.level;
                            switch (e < nc.bns.training.Model.MIN_LEVEL_CAN_USE_MASTERY_LEVEL ? d = "level50Under" : e >= nc.bns.training.Model.LEVEL_SWITCH_MASTERY_LEVEL_RANGE && (d = "level50Over"), d) {
                            case "level50Under":
                                nc.bns.training.Model.level = b, nc.bns.training.Model.masteryLevel = 0, nc.bns.training.Model.skillPointTotal = nc.bns.training.Model.level - nc.bns.training.Model.MIN_LEVEL_CAN_USE_SKILL_POINT + 1 + nc.bns.training.util.ObjectUtil.getAccumulatedNumberVal(nc.bns.training.Model.MASTERY_LEVEL_POINTS, String(nc.bns.training.Model.masteryLevel)), nc.bns.training.Model.skillPointRemained = nc.bns.training.Model.skillPointTotal - nc.bns.training.Model.skillPointConsumed, _categoryContents.sortListBySortOptionIndexByExternal(), _categoryContents.activateCategorySkillListBySkillId(nc.bns.training.Model.lastSelectedSkillListSkillId), resetTreeContentsAndTooltipContentsBySkillId(nc.bns.training.Model.lastSelectedSkillListSkillId), _treeContents.displaySkillPointTotalByExternal(nc.bns.training.Model.skillPointTotal), b < nc.bns.training.Model.MIN_LEVEL_CAN_USE_MASTERY_LEVEL || b >= nc.bns.training.Model.LEVEL_SWITCH_MASTERY_LEVEL_RANGE && (bindMasterySelectLevelInteraction(!0), _selectMasteryLevel.switchMasteryLevelLange(parseInt(nc.bns.training.Model.MASTERY_LEVEL_RANGE_BY_LEVEL_OBJ[String(nc.bns.training.Model.LEVEL_SWITCH_MASTERY_LEVEL_RANGE)])), _selectMasteryLevel.displayMasteryLevel(nc.bns.training.Model.masteryLevel), _selectMasteryLevel.setMouseInteraction(!0));
                                break;
                            case "level50Over":
                                b >= nc.bns.training.Model.LEVEL_SWITCH_MASTERY_LEVEL_RANGE && (nc.bns.training.Model.level = b, nc.bns.training.Model.skillPointTotal = nc.bns.training.Model.level - nc.bns.training.Model.MIN_LEVEL_CAN_USE_SKILL_POINT + 1 + nc.bns.training.util.ObjectUtil.getAccumulatedNumberVal(nc.bns.training.Model.MASTERY_LEVEL_POINTS, String(nc.bns.training.Model.masteryLevel)), nc.bns.training.Model.skillPointRemained = nc.bns.training.Model.skillPointTotal - nc.bns.training.Model.skillPointConsumed, _categoryContents.sortListBySortOptionIndexByExternal(), _categoryContents.activateCategorySkillListBySkillId(nc.bns.training.Model.lastSelectedSkillListSkillId), resetTreeContentsAndTooltipContentsBySkillId(nc.bns.training.Model.lastSelectedSkillListSkillId), _treeContents.displaySkillPointTotalByExternal(nc.bns.training.Model.skillPointTotal))
                            }
                            _categoryContents.setCategoryContainerPosY(nc.bns.training.Model.wheelScrollCategoryContainerPosY)
                        }
                        break;
                    case nc.bns.training.select.SelectLevel.OPEN_SELECT_LEVEL:
                        _selectMasteryLevel && _selectMasteryLevel.openByExternal(!1), setBodyMouseInteractionForCloseMasteryLevelSelectUI(!0)
                    }
                }

                function setBodyMouseInteractionForCloseMasteryLevelSelectUI(a) {
                    $("body").unbind("click", bodyMouseEventHandler), a && $("body").bind("click", bodyMouseEventHandler)
                }

                function bodyMouseEventHandler(a) {
                    switch (a.preventDefault(), a.stopPropagation(), a.type) {
                    case "click":
                        _selectLevel && _selectLevel.openByExternal(!1), _selectMasteryLevel && _selectMasteryLevel.openByExternal(!1), setBodyMouseInteractionForCloseMasteryLevelSelectUI(!1)
                    }
                }

                function selectMasteryLevelEventHandler(a) {
                    switch (a.preventDefault(), a.stopPropagation(), a.type) {
                    case nc.bns.training.select.SelectMasteryLevel.OPEN_MASTERY_SELECT_LEVEL:
                        _selectLevel && _selectLevel.openByExternal(!1), _selectMasteryLevel && _selectMasteryLevel.openByExternal(!0), setBodyMouseInteractionForCloseMasteryLevelSelectUI(!0);
                        break;
                    case nc.bns.training.select.SelectMasteryLevel.SELECT_MASTERY_LEVEL:
                        var b = a.level;
                        if (b == nc.bns.training.Model.masteryLevel) return;
                        if (b < nc.bns.training.Model.masteryLevel) {
                            var c = {
                                character_level: nc.bns.training.Model.level,
                                character_mastery_level: b,
                                character_job: nc.bns.training.Model.job,
                                json_slot_data: {}
                            };
                            resettingByJsonDataObj(c)
                        } else nc.bns.training.Model.level = nc.bns.training.Model.level, nc.bns.training.Model.masteryLevel = b, nc.bns.training.Model.skillPointTotal = nc.bns.training.Model.level - nc.bns.training.Model.MIN_LEVEL_CAN_USE_SKILL_POINT + 1 + nc.bns.training.util.ObjectUtil.getAccumulatedNumberVal(nc.bns.training.Model.MASTERY_LEVEL_POINTS, String(nc.bns.training.Model.masteryLevel)), nc.bns.training.Model.skillPointRemained = nc.bns.training.Model.skillPointTotal - nc.bns.training.Model.skillPointConsumed, resetTreeContentsAndTooltipContentsBySkillId(nc.bns.training.Model.lastSelectedSkillListSkillId), _treeContents.displaySkillPointTotalByExternal(nc.bns.training.Model.skillPointTotal)
                    }
                }

                function categoryContentsEventHandler(a) {
                    switch (a.preventDefault(), a.type) {
                    case nc.bns.training.category.Contents.TRIGGER_SELECT_SKILL_LIST:
                        setTreeContentsAndTooltipContentsBySkillId(String(a.skillId));
                        break;
                    case nc.bns.training.category.Contents.TRIGGER_SELECT_SORT_MENU:
                        var b = a.sortOptionIndex;
                        nc.bns.training.Model.sortOptionIndex = b, _categoryContents.activateCategorySkillListBySkillId(nc.bns.training.Model.lastSelectedSkillListSkillId), nc.bns.training.Model.wheelScrollCategoryContainerPosY = 0
                    }
                }

                function treeContentsEventHandler(a) {
                    switch (a.preventDefault(), a.type) {
                    case nc.bns.training.tree.Contents.MOUSEOVER_SLOT:
                        _tooltipContents.displayDiffData(a);
                        break;
                    case nc.bns.training.tree.Contents.MOUSEOUT_SLOT:
                        _tooltipContents.setSkillToolTip(nc.bns.training.Model.lastSelectedSkillListSkillId);
                        break;
                    case nc.bns.training.tree.Contents.CONSUME_SKILL_POINT:
                        var b = a.skillId,
                            c = a.treeId,
                            d = a.prevTrainSkillIdArr,
                            e = a.skillType,
                            f = a.slotType,
                            g = a.switchSkillData,
                            h = a.variationData,
                            i = a.required_tp,
                            j = !1,
                            k = "";
                        if (nc.bns.training.Model.skillPointConsumed >= nc.bns.training.Model.skillPointTotal) return;
                        if (nc.bns.training.Model.skillPointConsumed + i > nc.bns.training.Model.skillPointTotal) return;
                        switch (nc.bns.training.Model.skillPointConsumed += i, nc.bns.training.Model.skillPointRemained = nc.bns.training.Model.skillPointTotal - nc.bns.training.Model.skillPointConsumed, e) {
                        case "":
                            switch (f) {
                            case nc.bns.training.Model.SLOT_ACQUISITION:
                                _categoryContents.consumePointToSkillListInCategoryContainer(c, i), _tooltipContents.setSkillToolTip(nc.bns.training.Model.lastSelectedSkillListSkillId), j = !1;
                                break;
                            case "":
                                _categoryContents.consumePointToSkillListInCategoryContainer(c, i), h && _categoryContents.replaceNormalSkillListThumbInCategoryContainer(c, h.variation_id), _tooltipContents.setSkillToolTip(nc.bns.training.Model.lastSelectedSkillListSkillId), j = !1;
                                break;
                            case nc.bns.training.Model.SLOT_REPLACE:
                                if (!g) return;
                                _categoryContents.consumePointToSkillListInCategoryContainer(c, i), _categoryContents.replaceSkillListInCategoryContainer(b, g.variationId, g.alias, g.skillName), _tooltipContents.setSkillToolTip(nc.bns.training.Model.lastSelectedSkillListSkillId), j = !0, k = c
                            }
                            break;
                        case nc.bns.training.Model.SKILL_TYPE_ACQUISITION:
                            switch (f) {
                            case nc.bns.training.Model.SLOT_ACQUISITION:
                                _categoryContents.consumePointToSkillListInCategoryContainer(c, i), _tooltipContents.setSkillToolTip(nc.bns.training.Model.lastSelectedSkillListSkillId), j = !1;
                                break;
                            case "":
                                _categoryContents.consumePointToSkillListInCategoryContainer(c, i), _tooltipContents.setSkillToolTip(nc.bns.training.Model.lastSelectedSkillListSkillId), j = !1;
                                break;
                            case nc.bns.training.Model.SLOT_REPLACE:
                                if (!g) return;
                                _categoryContents.consumePointToSkillListInCategoryContainer(c, i), _categoryContents.replaceSkillListInCategoryContainer(b, g.variationId, g.alias, g.skillName), _tooltipContents.setSkillToolTip(nc.bns.training.Model.lastSelectedSkillListSkillId), j = !0, k = nc.bns.training.Model.lastSelectedSkillListSkillId
                            }
                            break;
                        case nc.bns.training.Model.SKILL_TYPE_SHARE:
                            switch (f) {
                            case nc.bns.training.Model.SLOT_ACQUISITION:
                                _categoryContents.consumePointToSkillListInCategoryContainer(c, i), _tooltipContents.setSkillToolTip(nc.bns.training.Model.lastSelectedSkillListSkillId), j = !1;
                                break;
                            case "":
                                _categoryContents.consumePointToSkillListInCategoryContainer(c, i), _tooltipContents.setSkillToolTip(nc.bns.training.Model.lastSelectedSkillListSkillId), j = !1;
                                break;
                            case nc.bns.training.Model.SLOT_REPLACE:
                                if (!g) return;
                                _categoryContents.consumePointToSkillListInCategoryContainer(c, i), _categoryContents.replaceSkillListInCategoryContainer(b, g.variationId, g.alias, g.skillName), _tooltipContents.setSkillToolTip(nc.bns.training.Model.lastSelectedSkillListSkillId), j = !0, k = nc.bns.training.Model.lastSelectedSkillListSkillId
                            }
                        }
                        if (setCategoryTreeSkillListStatusToTrainSkillLists(c, d), setCategoryTreeSkillListStatusToShareSkillLists(c), _categoryContents.activateCategorySkillListBySkillId(nc.bns.training.Model.lastSelectedSkillListSkillId), _treeContents.displaySkillPointConsumedByExternal(String(nc.bns.training.Model.skillPointConsumed)), j) {
                            var l = _categoryContents.getSkillListPosYInCategoryContainer(k);
                            _categoryContents.setCategoryContainerPosY(-l), nc.bns.training.Model.wheelScrollCategoryContainerPosY = -l
                        } else _categoryContents.setCategoryContainerPosY(nc.bns.training.Model.wheelScrollCategoryContainerPosY);
                        break;
                    case nc.bns.training.tree.Contents.CANCEL_SKILL_POINT:
                        var tempScrollTop;
                        tempScrollTop = $("div.categoryBody").scrollTop();
                        j = a.flag_changeSkillName;
                        var m = getTrainAllSkillJsonData(),
                            n = {
                                character_level: parseInt(nc.bns.training.Model.level),
                                character_mastery_level: parseInt(nc.bns.training.Model.masteryLevel),
                                character_job: String(nc.bns.training.Model.job),
                                json_slot_data: m
                            };
                        if (resettingByJsonDataObj(n), j) {
                            var l = _categoryContents.getSkillListPosYInCategoryContainer(nc.bns.training.Model.lastSelectedSkillListSkillId);
                            _categoryContents.setCategoryContainerPosY(-l), nc.bns.training.Model.wheelScrollCategoryContainerPosY = -l
                        } else _categoryContents.setCategoryContainerPosY(nc.bns.training.Model.wheelScrollCategoryContainerPosY)
                        $("div.categoryBody").scrollTop(tempScrollTop);
                    }
                }

                function setCategoryTreeSkillListStatusToTrainSkillLists(a, b) {
                    for (var c, d = 0, e = b.length; e > d; d++) c = b[d], c != a && _categoryContents.setTreeSkillListStatusToAcquisitionSkillListByExternal(a, c)
                }

                function setCategoryTreeSkillListStatusToShareSkillLists(a) {
                    for (var b, c = nc.bns.training.util.SearchDataUtil.getShareSkillListObjFromCustomGlobalModelArrByTreeId(a), d = 0, e = c.length; e > d; d++) b = c[d], _categoryContents.setTreeSkillListStatusToShareSkillListByExternal(a, b.skill_id)
                }

                function getHeaderStr() {
                    var a = '<div class="header"><a href="javascript:void()" class="job" data-toggle="offcanvas" data-recalc="false" data-target=".navmenu" data-canvas=".canvas"><strong>' + nc.bns.training.Model.JOB_NAME_OBJ[nc.bns.training.Model.job] + '</strong></a><span class="level select_level">Level <strong>' + nc.bns.training.Model.level + '</strong><span class="btn_level"></span><ul class="ly_level"></ul></span><span class="mastery_level select_level">' + nc.bns.training.Model.masteryTitle + "<strong>" + nc.bns.training.Model.masteryLevel + '</strong><span class="btn_level"></span><ul class="ly_level"><li>0</li></ul></span><span><a href="#" data-toggle="modal" class="btn_reset_all" data-target="#resetAll">Reset All</a></span><span><a href="#" data-toggle="modal" class="btn_reset" data-target="#reset">Reset Skill</a></span></div>';
                    return a
                }
                setBodyMouseInteractionForCloseMasteryLevelSelectUI(!1), _contents ? $(_contents).empty() : _contents = $(options.containerSelector).get(0), $flag_initializeFirst ? (nc.bns.training.Model.level = parseInt(options.level), nc.bns.training.Model.masteryLevel = parseInt(options.masteryLevel), nc.bns.training.Model.level < nc.bns.training.Model.MIN_LEVEL_CAN_USE_MASTERY_LEVEL ? (nc.bns.training.Model.masteryLevel = 0, flag_canUseSelectMastery = !1) : flag_canUseSelectMastery = !0, nc.bns.training.Model.job = String(options.job), nc.bns.training.Model.masteryTitle = String(options.masteryTitle), nc.bns.training.Model.maxLevel = parseInt(options.maxLevel), nc.bns.training.Model.editable = nc.bns.training.util.CheckUtil.available(options.editable) ? options.editable : !0) : (nc.bns.training.Model.level = parseInt($jsonObj.character_level), nc.bns.training.Model.masteryLevel = parseInt($jsonObj.character_mastery_level), nc.bns.training.Model.level < nc.bns.training.Model.MIN_LEVEL_CAN_USE_MASTERY_LEVEL ? (nc.bns.training.Model.masteryLevel = 0, flag_canUseSelectMastery = !1) : flag_canUseSelectMastery = !0, nc.bns.training.Model.job = String($jsonObj.character_job)), nc.bns.training.Model.skillPointTotal = nc.bns.training.Model.level < nc.bns.training.Model.MIN_LEVEL_CAN_USE_SKILL_POINT ? 0 : nc.bns.training.Model.level - nc.bns.training.Model.MIN_LEVEL_CAN_USE_SKILL_POINT + 1 + nc.bns.training.util.ObjectUtil.getAccumulatedNumberVal(nc.bns.training.Model.MASTERY_LEVEL_POINTS, String(nc.bns.training.Model.masteryLevel)), nc.bns.training.Model.skillPointConsumed = 0, nc.bns.training.Model.skillPointRemained = nc.bns.training.Model.skillPointTotal;
                var category_data = eval("category_data_" + nc.bns.training.Model.job),
                    slot_data = eval("slot_data_" + nc.bns.training.Model.job),
                    skill_data = eval("skill_data_" + nc.bns.training.Model.job);
                nc.bns.training.Model.CATEGORY_OBJ_ARR = [];
                for (var obj in category_data) nc.bns.training.Model.CATEGORY_OBJ_ARR.push(category_data[obj]);
                nc.bns.training.Model.SLOT_OBJ_JSON = slot_data, nc.bns.training.Model.SKILL_OBJ_JSON = skill_data;
                var objArr = [];
                $.extend(!0, objArr, nc.bns.training.Model.CATEGORY_OBJ_ARR), nc.bns.training.Model.DATA_SKILL_TOOLTIP_OBJ_JSON = data_skill_tooltip, nc.bns.training.Model.DATA_SKILL_TOOLTIP_ATTRIBUTE_OBJ_JSON = data_skill_tooltip_attribute;
                for (var _tmpObj, initialStr, i = 0, max = objArr.length; max > i; i++) {
                    if (_tmpObj = objArr[i], _tmpObj.name2_refine && (initialStr = _tmpObj.name2_refine, _tmpObj.initName2Refine = initialStr, _tmpObj.initJamoStr = nc.bns.training.util.StringUtil.getInitialJamoStr(initialStr, nc.bns.training.Model.SORT_NAME_ARR), _tmpObj.name2_refine = initialStr), _tmpObj.consumedSkillPoint = 0, _tmpObj.learnedSkillVariationId = "", _tmpObj.learnedSkillTooltipAlias = "", _tmpObj.learnedSkillAlias = "", _tmpObj.skillType = "", _tmpObj.disable = "", getFlagNoTrainingSkill(_tmpObj)) _tmpObj.skillType = nc.bns.training.Model.SKILL_TYPE_NONE;
                    else if (_tmpObj.skill_id != _tmpObj.tree_id) {
                        var treeObj = nc.bns.training.Model.SLOT_OBJ_JSON[String(_tmpObj.tree_id)],
                            flag_break = !1,
                            flag_acquisitionSkill = !1,
                            slotObj, variationObj;
                        for (var slotNo in treeObj) {
                            slotObj = treeObj[slotNo];
                            for (var variationNo in slotObj) {
                                if (variationObj = slotObj[variationNo], variationObj.name2_refine == _tmpObj.name2_refine) {
                                    flag_break = !0, variationObj.parent_train[0] != variationObj.skill_id && (flag_acquisitionSkill = !0);
                                    break
                                }
                                if (22250 == variationObj.skill_id || 22300 == variationObj.skill_id) {
                                    flag_break = !0, flag_acquisitionSkill = !0;
                                    break
                                }
                            }
                            if (flag_break) break
                        }
                        if (flag_break)
                            if (flag_acquisitionSkill) {
                                _tmpObj.skillType = nc.bns.training.Model.SKILL_TYPE_ACQUISITION;
                            } else {
                                var flag_existTreeId = !1;
                                for (var index in variationObj.parent_train)
                                    if (variationObj.parent_train[index] == variationObj.tree_id) {
                                        flag_existTreeId = !0;
                                        break
                                    }
                                _tmpObj.skillType = flag_existTreeId ? nc.bns.training.Model.SKILL_TYPE_SHARE : nc.bns.training.Model.SKILL_TYPE_ACQUISITION
                            } else _tmpObj.skillType = nc.bns.training.Model.SKILL_TYPE_SHARE, treeObj || (_tmpObj.skillType = nc.bns.training.Model.SKILL_TYPE_NONE)
                    }
                    if (_tmpObj.skill_id == 27400 || _tmpObj.skill_id == 26214 || _tmpObj.skill_id == 21019 || _tmpObj.skill_id == 99999) {
                        _tmpObj.disable = nc.bns.training.Model.SKILL_TYPE_HIDDEN;
                    }
                    if (_tmpObj.skill_id == 20106 || _tmpObj.skill_id == 20312 || _tmpObj.skill_id == 27150) {
                        _tmpObj.skillType = nc.bns.training.Model.SKILL_TYPE_ACQUISITION;
                    }
                    if (_tmpObj.skill_id == 28030) {
                        _tmpObj.disable = nc.bns.training.Model.NO_DISABLE;
                    }
                }
                nc.bns.training.Model.CUSTOM_CATEGORY_OBJ_ARR = objArr;
                var tmpSkillObj, tmpSkillId, tmpSkillObjArr;
                for (var tooltipAliasTitle in skill_data) tmpSkillObj = skill_data[tooltipAliasTitle], tmpSkillObj.tooltipAlias = tooltipAliasTitle, nc.bns.training.Model.COLLECTION_ARRAY_HAS_SKILL_OBJ_JSON_BY_SKILL_ID[String(tmpSkillObj.id)] ? (tmpSkillObjArr = nc.bns.training.Model.COLLECTION_ARRAY_HAS_SKILL_OBJ_JSON_BY_SKILL_ID[String(tmpSkillObj.id)], tmpSkillObjArr.push(tmpSkillObj)) : (tmpSkillObjArr = [], tmpSkillObjArr.push(tmpSkillObj), nc.bns.training.Model.COLLECTION_ARRAY_HAS_SKILL_OBJ_JSON_BY_SKILL_ID[String(tmpSkillObj.id)] = tmpSkillObjArr);
                $(_contents).append(getHeaderStr());
                var categoryWrapElementStr = '<div class="categoryWrap"></div>',
                    treeWrapElementStr = '<div class="treeWrap"></div>',
                    tooltipWrapElementStr = '<div class="tooltipWrap"></div>';
                if ($(_contents).append(categoryWrapElementStr), $(_contents).append(treeWrapElementStr), $(_contents).append(tooltipWrapElementStr), _categoryContents && ($(_categoryContents).unbind(nc.bns.training.category.Contents.TRIGGER_SELECT_SKILL_LIST, categoryContentsEventHandler), $(_categoryContents).unbind(nc.bns.training.category.Contents.TRIGGER_SELECT_SORT_MENU, categoryContentsEventHandler), _categoryContents.destroy(), _categoryContents = null), _treeContents && ($(_treeContents).unbind(nc.bns.training.tree.Contents.CONSUME_SKILL_POINT, treeContentsEventHandler), $(_treeContents).unbind(nc.bns.training.tree.Contents.CANCEL_SKILL_POINT, treeContentsEventHandler), $(_treeContents).unbind(nc.bns.training.tree.Contents.MOUSEOVER_SLOT, treeContentsEventHandler), _treeContents.destroy(), _treeContents = null), _tooltipContents && (_tooltipContents.destroy(), _tooltipContents = null), _selectLevel && ($(_selectLevel).unbind(nc.bns.training.select.SelectLevel.SELECT_LEVEL, selectLevelEventHandler), $(_selectLevel).unbind(nc.bns.training.select.SelectLevel.OPEN_SELECT_LEVEL, selectLevelEventHandler), _selectLevel.destroy(), _selectLevel = null), _selectMasteryLevel && ($(_selectMasteryLevel).unbind(nc.bns.training.select.SelectMasteryLevel.SELECT_MASTERY_LEVEL, selectMasteryLevelEventHandler), $(_selectMasteryLevel).unbind(nc.bns.training.select.SelectMasteryLevel.OPEN_MASTERY_SELECT_LEVEL, selectMasteryLevelEventHandler), _selectMasteryLevel.destroy(), _selectMasteryLevel = null), _categoryContents = new nc.bns.training.category.Contents({
                        container: $(".categoryWrap", _contents).get(0),
                        objArr: nc.bns.training.Model.CUSTOM_CATEGORY_OBJ_ARR,
                        sortOptionIndex: nc.bns.training.Model.sortOptionIndex
                    }), $(_categoryContents).bind(nc.bns.training.category.Contents.TRIGGER_SELECT_SKILL_LIST, categoryContentsEventHandler), $(_categoryContents).bind(nc.bns.training.category.Contents.TRIGGER_SELECT_SORT_MENU, categoryContentsEventHandler), _treeContents = new nc.bns.training.tree.Contents({
                        container: $(".treeWrap", _contents).get(0),
                        objArr: nc.bns.training.Model.CUSTOM_CATEGORY_OBJ_ARR
                    }), $(_treeContents).bind(nc.bns.training.tree.Contents.CONSUME_SKILL_POINT, treeContentsEventHandler), $(_treeContents).bind(nc.bns.training.tree.Contents.CANCEL_SKILL_POINT, treeContentsEventHandler), $(_treeContents).bind(nc.bns.training.tree.Contents.MOUSEOVER_SLOT, treeContentsEventHandler), $(_treeContents).bind(nc.bns.training.tree.Contents.MOUSEOUT_SLOT, treeContentsEventHandler), _tooltipContents = new nc.bns.training.tooltip.Contents({
                        container: $(".tooltipWrap", _contents).get(0)
                    }), _selectLevel = new nc.bns.training.select.SelectLevel({
                        container: $(".level.select_level").get(0),
                        minLevelCanUseSkillPoint: nc.bns.training.Model.MIN_LEVEL_CAN_USE_SKILL_POINT,
                        maxLevel: nc.bns.training.Model.maxLevel,
                        editable: nc.bns.training.Model.editable
                    }), $(_selectLevel).bind(nc.bns.training.select.SelectLevel.SELECT_LEVEL, selectLevelEventHandler), $(_selectLevel).bind(nc.bns.training.select.SelectLevel.OPEN_SELECT_LEVEL, selectLevelEventHandler), _selectMasteryLevel = new nc.bns.training.select.SelectMasteryLevel({
                        container: $(".mastery_level.select_level").get(0),
                        editable: nc.bns.training.Model.editable
                    }), $(_selectMasteryLevel).bind(nc.bns.training.select.SelectMasteryLevel.SELECT_MASTERY_LEVEL, selectMasteryLevelEventHandler), $(_selectMasteryLevel).bind(nc.bns.training.select.SelectMasteryLevel.OPEN_MASTERY_SELECT_LEVEL, selectMasteryLevelEventHandler), $flag_initializeFirst) {
                    var firstSortedSkillId = _categoryContents.getSkillIdOfFirstSkillList();
                    _categoryContents.activateCategorySkillListBySkillId(firstSortedSkillId), _treeContents.setSkillTree(firstSortedSkillId), _tooltipContents.setSkillToolTip(firstSortedSkillId), nc.bns.training.Model.lastSelectedSkillListSkillId = firstSortedSkillId
                } else _categoryContents.activateCategorySkillListBySkillId(nc.bns.training.Model.lastSelectedSkillListSkillId), _treeContents.setSkillTree(nc.bns.training.Model.lastSelectedSkillListSkillId), _tooltipContents.setSkillToolTip(nc.bns.training.Model.lastSelectedSkillListSkillId);
                flag_canUseSelectMastery ? (bindMasterySelectLevelInteraction(!0), _selectMasteryLevel.switchMasteryLevelLange(parseInt(nc.bns.training.Model.MASTERY_LEVEL_RANGE_BY_LEVEL_OBJ[String(nc.bns.training.Model.LEVEL_SWITCH_MASTERY_LEVEL_RANGE)])), _selectMasteryLevel.displayMasteryLevel(nc.bns.training.Model.masteryLevel), _selectMasteryLevel.setMouseInteraction(!0)) : (bindMasterySelectLevelInteraction(!1), _selectMasteryLevel.setMouseInteraction(!1)), _selectLevel.displayLevel(nc.bns.training.Model.level), _selectMasteryLevel.displayMasteryLevel(nc.bns.training.Model.masteryLevel)
            }

            function getTrainAllSkillJsonData() {
                for (var a, b, c = nc.bns.training.Model.CUSTOM_CATEGORY_OBJ_ARR, d = {}, e = 0, f = c.length; f > e; e++)
                    if (a = c[e], "" != a.learnedSkillVariationId && (b = nc.bns.training.util.SearchDataUtil.getVariationObjHasVariationIdAndAlias(String(a.skill_id), String(a.learnedSkillVariationId), String(a.learnedSkillAlias)))) {
                        var g;
                        for (var h in b.train_skill_id) g = b.train_skill_id[h], nc.bns.training.util.CheckUtil.available(g) && (d[String(g)] = String(a.learnedSkillVariationId))
                    }
                return d
            }

            function resetTreeContentsAndTooltipContentsBySkillId(a) {
                var b, c = a,
                    d = nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr(c);
                switch (d.skillType) {
                case nc.bns.training.Model.SKILL_TYPE_NONE:
                    nc.bns.training.Model.lastSelectedSkillType = nc.bns.training.Model.SKILL_TYPE_NONE, _treeContents.setSkillTree(c), _tooltipContents.setSkillToolTip(c);
                    break;
                case nc.bns.training.Model.SKILL_TYPE_ACQUISITION:
                    nc.bns.training.Model.lastSelectedSkillType = nc.bns.training.Model.SKILL_TYPE_ACQUISITION, b = String(d.tree_id), _treeContents.setTreeIdSkillTree(b, c), _tooltipContents.setSkillToolTip(c);
                    break;
                case nc.bns.training.Model.SKILL_TYPE_SHARE:
                    nc.bns.training.Model.lastSelectedSkillType = nc.bns.training.Model.SKILL_TYPE_SHARE, b = String(d.tree_id), _treeContents.setTreeIdSkillTree(b, c), _tooltipContents.setSkillToolTip(c);
                    break;
                default:
                    nc.bns.training.Model.lastSelectedSkillType = "", _treeContents.resetSkillTreeBySkillId(c), _tooltipContents.setSkillToolTip(c)
                }
                nc.bns.training.Model.lastSelectedSkillListSkillId = c
            }

            function setTreeContentsAndTooltipContentsBySkillId(a) {
                var b, c = a,
                    d = nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr(c);
                switch (d.skillType) {
                case nc.bns.training.Model.SKILL_TYPE_NONE:
                    nc.bns.training.Model.lastSelectedSkillType = nc.bns.training.Model.SKILL_TYPE_NONE, _treeContents.setSkillTree(c), _tooltipContents.setSkillToolTip(c);
                    break;
                case nc.bns.training.Model.SKILL_TYPE_ACQUISITION:
                    nc.bns.training.Model.lastSelectedSkillType = nc.bns.training.Model.SKILL_TYPE_ACQUISITION, b = String(d.tree_id), _treeContents.setTreeIdSkillTree(b, c), _tooltipContents.setSkillToolTip(c);
                    break;
                case nc.bns.training.Model.SKILL_TYPE_SHARE:
                    nc.bns.training.Model.lastSelectedSkillType = nc.bns.training.Model.SKILL_TYPE_SHARE, b = String(d.tree_id), _treeContents.setTreeIdSkillTree(b, c), _tooltipContents.setSkillToolTip(c);
                    break;
                default:
                    nc.bns.training.Model.lastSelectedSkillType = "", _treeContents.setSkillTree(c), _tooltipContents.setSkillToolTip(c)
                }
                nc.bns.training.Model.lastSelectedSkillListSkillId = c
            }

            function setSkillListStatusInCategoryByData(a) {
                a && _categoryContents.setSkillListsStatusByExternal(a)
            }

            function resettingByJsonDataObj(a) {
                init(!1, a), setSkillListStatusInCategoryByData(a.json_slot_data), resetTreeContentsAndTooltipContentsBySkillId(nc.bns.training.Model.lastSelectedSkillListSkillId);
                for (var b, c = 0, d = 0, e = nc.bns.training.Model.CUSTOM_CATEGORY_OBJ_ARR.length; e > d; d++)
                    if (b = nc.bns.training.Model.CUSTOM_CATEGORY_OBJ_ARR[d], "" != b.learnedSkillTooltipAlias) {
                        if ("" != b.skillType) continue;
                        c += parseInt(b.consumedSkillPoint)
                    }
                _treeContents.displaySkillPointConsumedByExternal(c), nc.bns.training.Model.skillPointConsumed = c, nc.bns.training.Model.skillPointRemained = nc.bns.training.Model.skillPointTotal - nc.bns.training.Model.skillPointConsumed, nc.bns.training.Model.skillPointRemained <= 0 && _treeContents.resetSkillTreeBySkillId(String(nc.bns.training.Model.lastSelectedSkillListSkillId))
                setTreeContentsAndTooltipContentsBySkillId(String("99999"));
                setTreeContentsAndTooltipContentsBySkillId(String(current));
            }

            function resettingByLoadJsonData(a) {
                function b(a, b) {
                    var c, d, e, f, k = !1;
                    for (var n in nc.bns.training.Model.SLOT_OBJ_JSON) {
                        d = nc.bns.training.Model.SLOT_OBJ_JSON[n];
                        for (var o in d) {
                            e = d[o];
                            for (var p in e)
                                if (f = e[p], f.skill_id == a && f.variation_id == b && (c = {
                                        slotNo: o,
                                        tree_id: String(f.tree_id),
                                        skill_id: m,
                                        variation_id: String(f.variation_id)
                                    }, k = !0), k) break;
                            if (k) break
                        }
                        if (k) break
                    }
                    if (k) {
                        for (var q, r, s = !1, t = 0, u = l.length; u > t; t++)
                            if (q = l[t], q.tree_id == c.tree_id) {
                                r = q, s = !0;
                                break
                            }
                        s ? (g = String(r.slotNo), h = String(c.slotNo), i = parseInt(g.charAt(0)), j = parseInt(h.charAt(0)), j > i && (nc.bns.training.util.ArrayUtil.removeElement(l, r), l.push(c))) : l.push(c)
                    }
                }
                var c = $.parseJSON(a);
                if (c) {
                    nc.bns.training.Model.job = String(c.character_job);
                    var d, e, f, g, h, i, j, k = c.json_slot_data,
                        l = [];
                    for (var m in k)
                        if (f = k[m], nc.bns.training.util.CheckUtil.available(nc.bns.training.Model.SLOT_OBJ_JSON[m])) {
                            var n = nc.bns.training.util.SearchDataUtil.getVariationObjHasVariationId(m, f);
                            if (n)
                                if (e = nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr(m), n.tree_id != n.skill_id);
                                else {
                                    var o = nc.bns.training.util.SearchDataUtil.getCustomVariationObjHasSkillIdAndVariationId(e.tree_id, e.skill_id, f);
                                    if (o) {
                                        for (var p, q, r = !1, s = 0, t = l.length; t > s; s++)
                                            if (p = l[s], p.tree_id == o.tree_id) {
                                                q = p, r = !0;
                                                break
                                            }
                                        r ? (g = String(q.slotNo), h = String(o.slotNo), i = parseInt(g.charAt(0)), j = parseInt(h.charAt(0)), j > i && (nc.bns.training.util.ArrayUtil.removeElement(l, q), l.push(o))) : l.push(o)
                                    }
                                }
                        } else if (e = nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr(m)) switch (e.skillType) {
                    case "":
                        break;
                    case nc.bns.training.Model.SKILL_TYPE_ACQUISITION:
                        var o = nc.bns.training.util.SearchDataUtil.getCustomVariationObjHasSkillIdAndVariationId(e.tree_id, e.skill_id, f);
                        if (o) {
                            for (var p, q, r = !1, s = 0, t = l.length; t > s; s++)
                                if (p = l[s], p.tree_id == o.tree_id) {
                                    q = p, r = !0;
                                    break
                                }
                            r ? (g = String(q.slotNo), h = String(o.slotNo), i = parseInt(g.charAt(0)), j = parseInt(h.charAt(0)), j > i && (nc.bns.training.util.ArrayUtil.removeElement(l, q), l.push(o))) : l.push(o)
                        }
                        break;
                    case nc.bns.training.Model.SKILL_TYPE_SHARE:
                        break;
                    case nc.bns.training.Model.SKILL_TYPE_NONE:
                        b(m, f)
                    } else b(m, f);
                    for (var u = {}, s = 0, t = l.length; t > s; s++) d = l[s], u[String(d.skill_id)] = d.variation_id;
                    c.json_slot_data = u, resettingByJsonDataObj(c)
                }
            }
            var _this = this,
                options = _options;
            _this.resetSelectedSkill = function () {
                var a = nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr(nc.bns.training.Model.lastSelectedSkillListSkillId);
                if (a) {
                    var b = nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr(a.tree_id);
                    if (b) {
                        var c = a.skill_id,
                            d = b.tree_id;
                        if ("" != b.learnedSkillVariationId) {
                            var e = b.consumedSkillPoint,
                                f = b.name2_refine,
                                g = b.initName2Refine,
                                h = !1;
                            f != g && (h = !0), b.consumedSkillPoint = 0, b.learnedSkillVariationId = "", b.learnedSkillTooltipAlias = "", b.learnedSkillAlias = "", b.name2_refine = g, b.initJamoStr = nc.bns.training.util.StringUtil.getInitialJamoStr(g.charAt(0), nc.bns.training.Model.SORT_NAME_ARR), nc.bns.training.Model.skillPointConsumed = nc.bns.training.Model.skillPointConsumed - e, nc.bns.training.Model.skillPointRemained = nc.bns.training.Model.skillPointTotal - nc.bns.training.Model.skillPointConsumed;
                            for (var i, j = nc.bns.training.util.SearchDataUtil.getAcquisitionSkillListObjFromCustomGlobalModelArrByTreeId(d), k = 0, l = j.length; l > k; k++) i = j[k], i.consumedSkillPoint = 0;
                            for (var m = nc.bns.training.util.SearchDataUtil.getShareSkillListObjFromCustomGlobalModelArrByTreeId(d), k = 0, l = m.length; l > k; k++) i = m[k], i.consumedSkillPoint = 0;
                            if (_categoryContents.reset(), _categoryContents.activateCategorySkillListBySkillId(c), resetTreeContentsAndTooltipContentsBySkillId(nc.bns.training.Model.lastSelectedSkillListSkillId), _treeContents.resetSkillTreeBySkillId(d), _treeContents.displaySkillPointConsumedByExternal(String(nc.bns.training.Model.skillPointConsumed)), _tooltipContents.setSkillToolTip(c), h) {
                                var n = _categoryContents.getSkillListPosYInCategoryContainer(c);
                                _categoryContents.setCategoryContainerPosY(-n), nc.bns.training.Model.wheelScrollCategoryContainerPosY = -n
                            } else _categoryContents.setCategoryContainerPosY(nc.bns.training.Model.wheelScrollCategoryContainerPosY)
                        }
                    }
                }
            }, _this.resetAllSkill = function () {
                var a = {
                    character_level: nc.bns.training.Model.level,
                    character_mastery_level: nc.bns.training.Model.masteryLevel,
                    character_job: nc.bns.training.Model.job,
                    json_slot_data: {}
                };
                resettingByJsonDataObj(a)
            }, _this.getSendDataObj = function () {
                function a() {
                    function a(a, b, c) {
                        var d = [],
                            e = {};
                        return e.makeTrainSkillVariationArr = function (e, f) {
                            var g, h, i = !1,
                                j = !1;
                            for (var k in a) {
                                g = a[k];
                                for (var l in g)
                                    if (f) {
                                        if (h = g[l], h.alias == prevTrainAliasStr) {
                                            var m = h.max_variation_level;
                                            "0" == m && (m = "1");
                                            var n = g[m];
                                            prevTrainAliasStr = n.prev_train[0], d.unshift(n), j = !0, i = !0;
                                            break
                                        }
                                    } else if (h = g[l], h.alias == c && h.variation_id == b) {
                                    prevTrainAliasStr = h.prev_train[0], d.unshift(h), j = !0, i = !0;
                                    break
                                }
                                if (i) break
                            }
                            j && e.makeTrainSkillVariationArr(e, !0)
                        }, e.makeTrainSkillVariationArr(e, !1), d
                    }
                    for (var b, c, d = nc.bns.training.Model.CUSTOM_CATEGORY_OBJ_ARR, e = {}, f = 0, g = d.length; g > f; f++)
                        if (b = d[f], "" != b.learnedSkillVariationId) switch (b.skillType) {
                        case "":
                            if (c = nc.bns.training.util.SearchDataUtil.getVariationObjHasVariationIdAndAlias(String(b.skill_id), String(b.learnedSkillVariationId), String(b.learnedSkillAlias)))
                                if (c.skill_id != c.tree_id)
                                    for (var h, i = a(nc.bns.training.Model.SLOT_OBJ_JSON[c.tree_id], c.variation_id, c.alias), j = 0, k = i.length; k > j; j++) {
                                        h = i[j], e[String(h.skill_id)] = h.variation_id;
                                        var l;
                                        for (var m in h.train_skill_id) l = h.train_skill_id[m], nc.bns.training.util.CheckUtil.available(l) && (e[String(l)] = String(l == h.skill_id ? h.variation_id : h.variation_id))
                                    } else
                                        for (var h, i = a(nc.bns.training.Model.SLOT_OBJ_JSON[c.tree_id], c.variation_id, c.alias), j = 0, k = i.length; k > j; j++) {
                                            h = i[j], e[String(h.skill_id)] = h.variation_id;
                                            var l;
                                            for (var m in h.train_skill_id) l = h.train_skill_id[m], nc.bns.training.util.CheckUtil.available(l) && (e[String(l)] = String(l == h.skill_id ? h.variation_id : h.variation_id))
                                        }
                        }
                    return e
                }
                var b = {
                    character_level: parseInt(nc.bns.training.Model.level),
                    character_mastery_level: parseInt(nc.bns.training.Model.masteryLevel),
                    character_job: String(nc.bns.training.Model.job),
                    json_slot_data: a()
                };
                return b
            }, _this.loadGetJsonData = function (a) {
                resettingByLoadJsonData(a)
            };
            var _contents, _categoryContents, _treeContents, _tooltipContents, _selectLevel, _selectMasteryLevel, flag_canUseSelectMastery = !0;
            return init(!0), _this
        }, nc.bns.training.tooltip.Contents = function (a) {
            function b(a) {
                for (var b, c = a.split("_"), d = -1, e = 0, f = c.length; f > e; e++) {
                    if (b = c[e], b.search(/^[0-9]+/) >= 0) {
                        d = e;
                        break
                    }
                    if (b.search(/^LV[0-9]+/i) >= 0) {
                        d = e;
                        break
                    }
                }
                if (d >= 0) {
                    c[d] = h;
                    var g = c.join("_");
                    return g
                }
                return ""
            }

            function c(a) {
                if (a) {
                    var b = a.required_tp ? a.required_tp : 0;
                    b > 1 ? (u.setRequiredTp(b), u.displayRequiredTp(!0)) : u.displayRequiredTp(!1)
                }
            }

            function d(a) {
                function d(a) {
                    a.tooltip_stance_refine ? (q.displaySkillInfo(a.tooltip_stance_refine), q.displayStanceRefine(!0)) : q.displayStanceRefine(!1), a.tooltip_condition_refine ? (r.displaySkillInfo(a.tooltip_condition_refine), r.displayUseCondition(!0)) : r.displayUseCondition(!1), a.complete_achievement_name_refine ? (t.displaySkillInfo(a.complete_achievement_name_refine), t.displayUseCondition(!0)) : t.displayUseCondition(!1), e(a), c(a)
                }

                function e(a) {
                    a.complete_quest_name_refine ? (a.complete_quest_desc_refine ? s.setEliteSkillInfo(String(a.complete_quest_name_refine), String(a.complete_quest_desc_refine)) : s.setLegendSkillInfo(String(a.complete_quest_name_refine)), s.displayAcquire(!0)) : s.displayAcquire(!1)
                }

                function g(a) {
                    var b = nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr(a);
                    b.tooltip_stance_refine ? (q.displaySkillInfo(b.tooltip_stance_refine), q.displayStanceRefine(!0)) : q.displayStanceRefine(!1), b.tooltip_condition_refine ? (r.displaySkillInfo(b.tooltip_condition_refine), r.displayUseCondition(!0)) : r.displayUseCondition(!1), b.complete_achievement_name_refine ? (t.displaySkillInfo(b.complete_achievement_name_refine), t.displayUseCondition(!0)) : t.displayUseCondition(!1)
                }

                function h() {
                    function a(a) {
                        for (var b, c = !1, d = 0, e = Q.length; e > d; d++) b = Q[d], a["target-attribute"] == b["target-attribute"] && a["effect-attribute"] == b["effect-attribute"] && a["condition-attribute"] == b["condition-attribute"] && a["effect-arg-1"] == b["effect-arg-1"] && a["effect-arg-2"] == b["effect-arg-2"] && a["effect-arg-3"] == b["effect-arg-3"] && a["effect-arg-4"] == b["effect-arg-4"] && (c = !0);
                        return c
                    }

                    function b(a) {
                        for (var b, c = !1, d = 0, e = Q.length; e > d; d++) b = Q[d], a["target-attribute"] == b["target-attribute"] && a["effect-attribute"] == b["effect-attribute"] && a["condition-attribute"] == b["condition-attribute"] && a["condition-arg-1"] == b["condition-arg-1"] && a["condition-arg-2"] == b["condition-arg-2"] && (c = !0);
                        return c
                    }

                    function c(a) {
                        for (var b, c = -1, d = 0, e = M.length; e > d; d++)
                            if (b = M[d], b["default-text"] == a["default-text"]) {
                                c = d;
                                break
                            }
                        return c
                    }

                    function d() {
                        var d = {};
                        d.matchM1Info = function (d) {
                            if (!(!O.length < 0)) {
                                for (var e, f, g = !1, h = !1, o = !1, p = 0, q = O.length; q > p; p++) {
                                    if (g = !1, h = !1, o = !1, e = O[p], !e["target-attribute"] && !e["effect-attribute"] && !e["condition-attribute"] && e["default-text"]) {
                                        var r = c(e);
                                        r >= 0 ? (S = document.createTextNode(e.title), Z.push(S), nc.bns.training.util.ArrayUtil.removeElement(O, e), nc.bns.training.util.ArrayUtil.removeElement(R, e), nc.bns.training.util.ArrayUtil.removeElement(M, M[r]), o = !0) : (V = $(k).clone(), V.html(e.title + n + l), Z.push(V), nc.bns.training.util.ArrayUtil.removeElement(O, e), nc.bns.training.util.ArrayUtil.removeElement(R, e), o = !0)
                                    }
                                    if (o) break;
                                    for (var f, s = 0, t = M.length; t > s; s++)
                                        if (f = M[s], f["target-attribute"] == e["target-attribute"] && f["effect-attribute"] == e["effect-attribute"] && f["condition-attribute"] == e["condition-attribute"]) {
                                            if (f["effect-arg-1"] != e["effect-arg-1"] || f["effect-arg-2"] != e["effect-arg-2"] || f["effect-arg-3"] != e["effect-arg-3"] || f["effect-arg-4"] != e["effect-arg-4"]) {
                                                for (var u = f["effect-attribute"], v = nc.bns.training.Model.DATA_SKILL_TOOLTIP_ATTRIBUTE_OBJ_JSON[u.toLowerCase()], w = -1, p = 1; 4 >= p; p++)
                                                    if ("text-alias" == v["arg-type-" + p]) {
                                                        w = p;
                                                        break
                                                    }
                                                if (w >= 1 && f["effect-arg-" + w] != e["effect-arg-" + w]) continue;
                                                a(f) ? (V = $(k).clone(), V.html(e.title + n + l), Z.push(V), nc.bns.training.util.ArrayUtil.removeElement(O, e), nc.bns.training.util.ArrayUtil.removeElement(R, e), o = !0) : (T = $(i).clone(), U = $(m).clone(), T.html(e.title + n + j), U.html(f.title), Z.push(T), Z.push(U), g = !0)
                                            }
                                            if (o) break;
                                            if (f["condition-arg-1"] != e["condition-arg-1"] || f["condition-arg-2"] != e["condition-arg-2"])
                                                if (b(f)) V = $(k).clone(), V.html(e.title + n + l), Z.push(V), nc.bns.training.util.ArrayUtil.removeElement(O, e), nc.bns.training.util.ArrayUtil.removeElement(R, e), o = !0;
                                                else {
                                                    var x = f["condition-attribute"];
                                                    switch (x) {
                                                    case "C_during_skill":
                                                        V = $(k).clone(), V.html(e.title + n + l), Z.push(V), U = $(m).clone(), U.html(f.title), Z.push(U), nc.bns.training.util.ArrayUtil.removeElement(Q, e), nc.bns.training.util.ArrayUtil.removeElement(R, e), nc.bns.training.util.ArrayUtil.removeElement(M, f), o = !0;
                                                        break;
                                                    case "C_after_using_skill2":
                                                        for (var y, z = !1, A = 0, B = M.length; B > A; A++)
                                                            if (y = M[A], y["condition-arg-1"] == e["condition-arg-1"] && y["condition-arg-2"] == e["condition-arg-2"]) {
                                                                f = y, z = !0;
                                                                break
                                                            }
                                                        z && (S = document.createTextNode(e.title), Z.push(S), nc.bns.training.util.ArrayUtil.removeElement(Q, e), nc.bns.training.util.ArrayUtil.removeElement(R, e), nc.bns.training.util.ArrayUtil.removeElement(M, f), o = !0);
                                                        break;
                                                    default:
                                                        T = $(i).clone(), U = $(m).clone(), T.html(e.title + n + j), U.html(f.title), Z.push(T), Z.push(U), h = !0
                                                    }
                                                }
                                            if (o) break;
                                            if (g || h ? (nc.bns.training.util.ArrayUtil.removeElement(O, e), nc.bns.training.util.ArrayUtil.removeElement(R, e), nc.bns.training.util.ArrayUtil.removeElement(M, f), o = !0) : (S = document.createTextNode(e.title), Z.push(S), nc.bns.training.util.ArrayUtil.removeElement(O, e), nc.bns.training.util.ArrayUtil.removeElement(R, e), nc.bns.training.util.ArrayUtil.removeElement(M, f), o = !0), o) break
                                        }
                                    if (o) break;
                                    if (V = $(k).clone(), V.html(e.title + n + l), Z.push(V), nc.bns.training.util.ArrayUtil.removeElement(O, e), nc.bns.training.util.ArrayUtil.removeElement(R, e), o = !0) break
                                }
                                o && d.matchM1Info(d)
                            }
                        }, d.matchM1Info(d)
                    }

                    function e() {
                        var d = {};
                        d.matchM2Info = function (d) {
                            if (!(!P.length < 0)) {
                                for (var e, f, g = !1, h = !1, o = !1, p = 0, q = P.length; q > p; p++) {
                                    if (g = !1, h = !1, o = !1, e = P[p], !e["target-attribute"] && !e["effect-attribute"] && !e["condition-attribute"] && e["default-text"]) {
                                        var r = c(e);
                                        r >= 0 ? (S = document.createTextNode(e.title), _.push(S), nc.bns.training.util.ArrayUtil.removeElement(P, e), nc.bns.training.util.ArrayUtil.removeElement(R, e), nc.bns.training.util.ArrayUtil.removeElement(M, M[r]), o = !0) : (V = $(k).clone(), V.html(e.title + n + l), _.push(V), nc.bns.training.util.ArrayUtil.removeElement(P, e), nc.bns.training.util.ArrayUtil.removeElement(R, e), o = !0)
                                    }
                                    if (o) break;
                                    for (var f, s = 0, t = M.length; t > s; s++)
                                        if (f = M[s], f["target-attribute"] == e["target-attribute"] && f["effect-attribute"] == e["effect-attribute"] && f["condition-attribute"] == e["condition-attribute"]) {
                                            if (f["effect-arg-1"] != e["effect-arg-1"] || f["effect-arg-2"] != e["effect-arg-2"] || f["effect-arg-3"] != e["effect-arg-3"] || f["effect-arg-4"] != e["effect-arg-4"]) {
                                                for (var u = f["effect-attribute"], v = nc.bns.training.Model.DATA_SKILL_TOOLTIP_ATTRIBUTE_OBJ_JSON[u.toLowerCase()], w = -1, p = 1; 4 >= p; p++)
                                                    if ("text-alias" == v["arg-type-" + p]) {
                                                        w = p;
                                                        break
                                                    }
                                                if (w >= 1 && f["effect-arg-" + w] != e["effect-arg-" + w]) continue;
                                                a(f) ? (V = $(k).clone(), V.html(e.title + n + l), _.push(V), nc.bns.training.util.ArrayUtil.removeElement(P, e), nc.bns.training.util.ArrayUtil.removeElement(R, e), o = !0) : (T = $(i).clone(), U = $(m).clone(), T.html(e.title + n + j), U.html(f.title), _.push(T), _.push(U), g = !0)
                                            }
                                            if (o) break;
                                            if (f["condition-arg-1"] != e["condition-arg-1"] || f["condition-arg-2"] != e["condition-arg-2"])
                                                if (b(f)) V = $(k).clone(), V.html(e.title + n + l), _.push(V), nc.bns.training.util.ArrayUtil.removeElement(P, e), nc.bns.training.util.ArrayUtil.removeElement(R, e), o = !0;
                                                else {
                                                    var x = f["condition-attribute"];
                                                    switch (x) {
                                                    case "C_during_skill":
                                                        V = $(k).clone(), V.html(e.title + n + l), _.push(V), U = $(m).clone(), U.html(f.title), _.push(U), nc.bns.training.util.ArrayUtil.removeElement(Q, e), nc.bns.training.util.ArrayUtil.removeElement(R, e), nc.bns.training.util.ArrayUtil.removeElement(M, f), o = !0;
                                                        break;
                                                    case "C_after_using_skill2":
                                                        for (var y, z = !1, A = 0, B = M.length; B > A; A++)
                                                            if (y = M[A], y["condition-arg-1"] == e["condition-arg-1"] && y["condition-arg-2"] == e["condition-arg-2"]) {
                                                                f = y, z = !0;
                                                                break
                                                            }
                                                        z && (S = document.createTextNode(e.title), _.push(S), nc.bns.training.util.ArrayUtil.removeElement(Q, e), nc.bns.training.util.ArrayUtil.removeElement(R, e), nc.bns.training.util.ArrayUtil.removeElement(M, f), o = !0);
                                                        break;
                                                    default:
                                                        T = $(i).clone(), U = $(m).clone(), T.html(e.title + n + j), U.html(f.title), _.push(T), _.push(U), h = !0
                                                    }
                                                }
                                            if (o) break;
                                            if (g || h ? (nc.bns.training.util.ArrayUtil.removeElement(P, e), nc.bns.training.util.ArrayUtil.removeElement(R, e), nc.bns.training.util.ArrayUtil.removeElement(M, f), o = !0) : (S = document.createTextNode(e.title), _.push(S), nc.bns.training.util.ArrayUtil.removeElement(P, e), nc.bns.training.util.ArrayUtil.removeElement(R, e), nc.bns.training.util.ArrayUtil.removeElement(M, f), o = !0), o) break
                                        }
                                    if (o) break;
                                    if (V = $(k).clone(), V.html(e.title + n + l), _.push(V), nc.bns.training.util.ArrayUtil.removeElement(P, e), nc.bns.training.util.ArrayUtil.removeElement(R, e), o = !0) break
                                }
                                o && d.matchM2Info(d)
                            }
                        }, d.matchM2Info(d)
                    }

                    function f() {
                        var d = {};
                        d.matchSubInfo = function (d) {
                            if (!(!Q.length < 0)) {
                                for (var e, f, g = !1, h = !1, o = !1, p = 0, q = Q.length; q > p; p++) {
                                    if (g = !1, h = !1, o = !1, e = Q[p], !e["target-attribute"] && !e["effect-attribute"] && !e["condition-attribute"] && e["default-text"]) {
                                        var r = c(e);
                                        r >= 0 ? (S = document.createTextNode(e.title), ab.push(S), nc.bns.training.util.ArrayUtil.removeElement(Q, e), nc.bns.training.util.ArrayUtil.removeElement(R, e), nc.bns.training.util.ArrayUtil.removeElement(M, M[r]), o = !0) : (V = $(k).clone(), V.html(e.title + n + l), ab.push(V), nc.bns.training.util.ArrayUtil.removeElement(Q, e), nc.bns.training.util.ArrayUtil.removeElement(R, e), o = !0)
                                    }
                                    if (o) break;
                                    for (var f, s = 0, t = M.length; t > s; s++)
                                        if (f = M[s], f["target-attribute"] == e["target-attribute"] && f["effect-attribute"] == e["effect-attribute"] && f["condition-attribute"] == e["condition-attribute"]) {
                                            if (f["effect-arg-1"] != e["effect-arg-1"] || f["effect-arg-2"] != e["effect-arg-2"] || f["effect-arg-3"] != e["effect-arg-3"] || f["effect-arg-4"] != e["effect-arg-4"]) {
                                                for (var u = f["effect-attribute"], v = nc.bns.training.Model.DATA_SKILL_TOOLTIP_ATTRIBUTE_OBJ_JSON[u.toLowerCase()], w = -1, p = 1; 4 >= p; p++)
                                                    if ("text-alias" == v["arg-type-" + p]) {
                                                        w = p;
                                                        break
                                                    }
                                                if (w >= 1 && f["effect-arg-" + w] != e["effect-arg-" + w]) continue;
                                                a(f) ? (V = $(k).clone(), V.html(e.title + n + l), ab.push(V), nc.bns.training.util.ArrayUtil.removeElement(Q, e), nc.bns.training.util.ArrayUtil.removeElement(R, e), o = !0) : (T = $(i).clone(), U = $(m).clone(), T.html(e.title + n + j), U.html(f.title), ab.push(T), ab.push(U), g = !0)
                                            }
                                            if (o) break;
                                            if (f["condition-arg-1"] != e["condition-arg-1"] || f["condition-arg-2"] != e["condition-arg-2"])
                                                if (b(f)) V = $(k).clone(), V.html(e.title + n + l), ab.push(V), nc.bns.training.util.ArrayUtil.removeElement(Q, e), nc.bns.training.util.ArrayUtil.removeElement(R, e), o = !0;
                                                else {
                                                    var x = f["condition-attribute"];
                                                    switch (x) {
                                                    case "C_during_skill":
                                                        V = $(k).clone(), V.html(e.title + n + l), ab.push(V), U = $(m).clone(), U.html(f.title), ab.push(U), nc.bns.training.util.ArrayUtil.removeElement(Q, e), nc.bns.training.util.ArrayUtil.removeElement(R, e), nc.bns.training.util.ArrayUtil.removeElement(M, f), o = !0;
                                                        break;
                                                    case "C_after_using_skill2":
                                                        for (var y, z = !1, A = 0, B = M.length; B > A; A++)
                                                            if (y = M[A], y["condition-arg-1"] == e["condition-arg-1"] && y["condition-arg-2"] == e["condition-arg-2"]) {
                                                                f = y, z = !0;
                                                                break
                                                            }
                                                        z && (S = document.createTextNode(e.title), ab.push(S), nc.bns.training.util.ArrayUtil.removeElement(Q, e), nc.bns.training.util.ArrayUtil.removeElement(R, e), nc.bns.training.util.ArrayUtil.removeElement(M, f), o = !0);
                                                        break;
                                                    default:
                                                        T = $(i).clone(), U = $(m).clone(), T.html(e.title + n + j), U.html(f.title), ab.push(T), ab.push(U), h = !0
                                                    }
                                                }
                                            if (o) break;
                                            if (g || h ? (nc.bns.training.util.ArrayUtil.removeElement(Q, e), nc.bns.training.util.ArrayUtil.removeElement(R, e), nc.bns.training.util.ArrayUtil.removeElement(M, f), o = !0) : (S = document.createTextNode(e.title), ab.push(S), nc.bns.training.util.ArrayUtil.removeElement(Q, e), nc.bns.training.util.ArrayUtil.removeElement(R, e), nc.bns.training.util.ArrayUtil.removeElement(M, f), o = !0), o) break
                                        }
                                    if (o) break;
                                    if (V = $(k).clone(), V.html(e.title + n + l), ab.push(V), nc.bns.training.util.ArrayUtil.removeElement(Q, e), nc.bns.training.util.ArrayUtil.removeElement(R, e), o = !0) break
                                }
                                o && d.matchSubInfo(d)
                            }
                        }, d.matchSubInfo(d)
                    }

                    function g() {
                        for (var a = M.concat(), b = 0, c = a.length; c > b; b++) originalInfoObj = a[b], "M1" == String(originalInfoObj["tooltip-group"]).toUpperCase() && (U = $(m).clone(), U.html(originalInfoObj.title), Z.push(U), nc.bns.training.util.ArrayUtil.removeElement(M, originalInfoObj))
                    }

                    function h() {
                        for (var a = M.concat(), b = 0, c = a.length; c > b; b++) originalInfoObj = a[b], "M2" == String(originalInfoObj["tooltip-group"]).toUpperCase() && (U = $(m).clone(), U.html(originalInfoObj.title), _.push(U), nc.bns.training.util.ArrayUtil.removeElement(M, originalInfoObj))
                    }

                    function q() {
                        for (var a = M.concat(), b = 0, c = a.length; c > b; b++) originalInfoObj = a[b], "SUB" == String(originalInfoObj["tooltip-group"]).toUpperCase() && (U = $(m).clone(), U.html(originalInfoObj.title), ab.push(U), nc.bns.training.util.ArrayUtil.removeElement(M, originalInfoObj))
                    }

                    function r() {
                        for (var a, b = 0, c = Z.length; c > b; b++) a = Z[b], $(W).append(a), c > b && $(W).append(document.createElement("br"))
                    }

                    function s() {
                        for (var a, b = 0, c = _.length; c > b; b++) a = _[b], $(X).append(a), c > b && $(X).append(document.createElement("br"))
                    }

                    function t() {
                        for (var a, b = 0, c = ab.length; c > b; b++) a = ab[b], $(Y).append(a), c > b && $(Y).append(document.createElement("br"))
                    }
                    var u = {},
                        v = {};
                    u = $.extend(!0, u, nc.bns.training.Model.DATA_SKILL_TOOLTIP_OBJ_JSON[I]), v = $.extend(!0, v, nc.bns.training.Model.DATA_SKILL_TOOLTIP_OBJ_JSON[H]);
                    var w, x, y = F.main_info1 ? F.main_info1.split("<br/>") : [],
                        z = F.main_info2 ? F.main_info2.split("<br/>") : [],
                        A = F.sub_info ? F.sub_info.split("<br/>") : [];
                    for (var B in v) switch (w = v[B], B) {
                    case "m1":
                        for (var C in w) x = w[C], x.title = y[parseInt(C)];
                        break;
                    case "m2":
                        for (var C in w) x = w[C], x.title = z[parseInt(C)];
                        break;
                    case "sub":
                        for (var C in w) x = w[C], x.title = A[parseInt(C)]
                    }
                    var w, x, D = G.main_info1 ? G.main_info1.split("<br/>") : [],
                        E = G.main_info2 ? G.main_info2.split("<br/>") : [],
                        J = G.sub_info ? G.sub_info.split("<br/>") : [];
                    for (var B in u) switch (w = u[B], B) {
                    case "m1":
                        for (var C in w) x = w[C], x.title = D[parseInt(C)];
                        break;
                    case "m2":
                        for (var C in w) x = w[C], x.title = E[parseInt(C)];
                        break;
                    case "sub":
                        for (var C in w) x = w[C], x.title = J[parseInt(C)]
                    }
                    var K, L, M = [];
                    for (var B in v) {
                        K = v[B];
                        for (var N in K) L = K[N], "CONDITION" != L["tooltip-group"] && "STANCE" != L["tooltip-group"] && M.push(L)
                    }
                    var K, L, O = [],
                        P = [],
                        Q = [],
                        R = [];
                    for (var B in u) {
                        K = u[B];
                        for (var N in K) switch (L = K[N], String(L["tooltip-group"]).toUpperCase()) {
                        case "M1":
                            R.push(L), O.push(L);
                            break;
                        case "M2":
                            R.push(L), P.push(L);
                            break;
                        case "SUB":
                            R.push(L), Q.push(L)
                        }
                    }
                    var S, T, U, V, W = document.createElement("div"),
                        X = document.createElement("div"),
                        Y = document.createElement("div"),
                        Z = [],
                        _ = [],
                        ab = [];
                    O.length > 0 && d(), P.length > 0 && e(), Q.length > 0 && f(), g(), r(), h(), s(), q(), t(), o.setAllInfoByExternal(W.innerHTML, X.innerHTML, Y.innerHTML), o.setSkillNameByExternal(G), o.setSkillThumbnailByExternal(G), o.setHealPointChangeDescByExternal(F, G), p.displaySkillInfoDiff(F, G)
                }

                function u(a, c) {
                    y = nc.bns.training.Model.COLLECTION_ARRAY_HAS_SKILL_OBJ_JSON_BY_SKILL_ID[a], z = y[0], F = nc.bns.training.Model.SKILL_OBJ_JSON[b(z.tooltipAlias)], F || (F = nc.bns.training.Model.SKILL_OBJ_JSON[z.tooltipAlias]), G = nc.bns.training.Model.SKILL_OBJ_JSON[c.tooltip_alias], v(F, G, c)
                }

                function v(a, b, c) {
                    H = String(a.tooltipAlias).toLowerCase(), I = String(b.tooltipAlias).toLowerCase(), h(), d(c)
                }

                function w(a, b, c) {
                    H = String(a.tooltipAlias).toLowerCase(), I = String(b.tooltipAlias).toLowerCase(), h(), g(c)
                }
                var x, y, z, A = a.variationData,
                    B = A.tree_id,
                    C = A.skill_id,
                    D = (a.skillType, a.slotType),
                    E = nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr(B),
                    F = null,
                    G = null,
                    H = "",
                    I = "";
                if ("" != E.learnedSkillVariationId) switch (x = nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr(nc.bns.training.Model.lastSelectedSkillListSkillId), x.skillType) {
                case "":
                    switch (D) {
                    case "":
                        y = nc.bns.training.Model.COLLECTION_ARRAY_HAS_SKILL_OBJ_JSON_BY_SKILL_ID[B], E = nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr(B);
                        for (var J, K = !1, L = 0, M = y.length; M > L; L++)
                            if (J = y[L], J.tooltipAlias == E.learnedSkillTooltipAlias) {
                                F = J, K = !0;
                                break
                            }
                        if (K);
                        else {
                            for (var N, O = nc.bns.training.util.SearchDataUtil.getPrevTrainedSkillVariationObjs(nc.bns.training.Model.SLOT_OBJ_JSON[B], E.learnedSkillAlias), L = O.length - 1; L >= 0; L--) N = O[L], N.skill_id != B && O.splice(L, 1);
                            if (O.length <= 0) F = y[0];
                            else {
                                var P = O[0];
                                F = f(P.tooltip_alias, y), F || (F = y[0])
                            }
                        }
                        G = nc.bns.training.Model.SKILL_OBJ_JSON[A.tooltip_alias], v(F, G, A);
                        break;
                    case nc.bns.training.Model.SLOT_REPLACE:
                        y = nc.bns.training.Model.COLLECTION_ARRAY_HAS_SKILL_OBJ_JSON_BY_SKILL_ID[B], E = nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr(B), F = nc.bns.training.Model.SKILL_OBJ_JSON[E.learnedSkillTooltipAlias], G = nc.bns.training.Model.SKILL_OBJ_JSON[A.tooltip_alias], v(F, G, A);
                        break;
                    case nc.bns.training.Model.SLOT_ACQUISITION:
                        y = nc.bns.training.Model.COLLECTION_ARRAY_HAS_SKILL_OBJ_JSON_BY_SKILL_ID[B], E = nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr(B);
                        for (var J, K = !1, L = 0, M = y.length; M > L; L++)
                            if (J = y[L], J.tooltipAlias == E.learnedSkillTooltipAlias) {
                                F = J, K = !0;
                                break
                            }
                        if (K) u(C, A);
                        else {
                            for (var N, O = nc.bns.training.util.SearchDataUtil.getPrevTrainedSkillVariationObjs(nc.bns.training.Model.SLOT_OBJ_JSON[B], E.learnedSkillAlias), L = O.length - 1; L >= 0; L--) N = O[L], N.skill_id == B && O.splice(L, 1);
                            if (y = nc.bns.training.Model.COLLECTION_ARRAY_HAS_SKILL_OBJ_JSON_BY_SKILL_ID[C], O.length <= 0) F = y[0];
                            else {
                                var Q = O[0];
                                F = f(Q.tooltip_alias, y)
                            }
                            F || A.skill_id != Q.skill_id && (y = nc.bns.training.Model.COLLECTION_ARRAY_HAS_SKILL_OBJ_JSON_BY_SKILL_ID[A.skill_id], F = y[0])
                        }
                        G = nc.bns.training.Model.SKILL_OBJ_JSON[A.tooltip_alias], v(F, G, A)
                    }
                    break;
                case nc.bns.training.Model.SKILL_TYPE_ACQUISITION:
                    switch (D) {
                    case "":
                        y = nc.bns.training.Model.COLLECTION_ARRAY_HAS_SKILL_OBJ_JSON_BY_SKILL_ID[B], E = nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr(B);
                        for (var J, K = !1, L = 0, M = y.length; M > L; L++)
                            if (J = y[L], J.tooltipAlias == E.learnedSkillTooltipAlias) {
                                F = J, K = !0;
                                break
                            }
                        if (K) G = nc.bns.training.Model.SKILL_OBJ_JSON[A.tooltip_alias];
                        else {
                            for (var N, O = nc.bns.training.util.SearchDataUtil.getPrevTrainedSkillVariationObjs(nc.bns.training.Model.SLOT_OBJ_JSON[B], E.learnedSkillAlias), L = O.length - 1; L >= 0; L--) N = O[L], N.skill_id != B && O.splice(L, 1);
                            if (O.length <= 0) F = y[0];
                            else {
                                var P = O[0];
                                F = f(P.tooltip_alias, y), F || (F = y[0])
                            }
                            G = nc.bns.training.Model.SKILL_OBJ_JSON[A.tooltip_alias]
                        }
                        v(F, G, A);
                        break;
                    case nc.bns.training.Model.SLOT_REPLACE:
                        y = nc.bns.training.Model.COLLECTION_ARRAY_HAS_SKILL_OBJ_JSON_BY_SKILL_ID[B], E = nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr(B), F = nc.bns.training.Model.SKILL_OBJ_JSON[E.learnedSkillTooltipAlias], G = nc.bns.training.Model.SKILL_OBJ_JSON[A.tooltip_alias], v(F, G, A);
                        break;
                    case nc.bns.training.Model.SLOT_ACQUISITION:
                        if (x.skill_id != A.skill_id) {
                            var K = !1;
                            y = nc.bns.training.Model.COLLECTION_ARRAY_HAS_SKILL_OBJ_JSON_BY_SKILL_ID[x.skill_id];
                            var R, S;
                            for (var T in A.train_skill_alias)
                                if (S = A.train_skill_alias[T]) {
                                    for (var U = 0, V = y.length; V > U; U++)
                                        if (R = y[U], R.tooltipAlias == S) {
                                            F = R, K = !0;
                                            break
                                        }
                                    if (K) break
                                }
                            if (K) {
                                for (var N, E = nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr(B), O = nc.bns.training.util.SearchDataUtil.getPrevTrainedSkillVariationObjs(nc.bns.training.Model.SLOT_OBJ_JSON[B], E.learnedSkillAlias), L = O.length - 1; L >= 0; L--) N = O[L], N.skill_id == B && O.splice(L, 1);
                                if (O.length <= 0) F = y[0];
                                else {
                                    var Q = O[0];
                                    F = f(Q.tooltip_alias, y), F || (F = y[0])
                                }
                                G = f(A.tooltip_alias, y), w(F, G, G.id), A.skill_id != G.id ? s.displayAcquire(!1) : e(A), c(A)
                            } else {
                                y = nc.bns.training.Model.COLLECTION_ARRAY_HAS_SKILL_OBJ_JSON_BY_SKILL_ID[C], E = nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr(B);
                                for (var N, O = nc.bns.training.util.SearchDataUtil.getPrevTrainedSkillVariationObjs(nc.bns.training.Model.SLOT_OBJ_JSON[B], E.learnedSkillAlias), L = O.length - 1; L >= 0; L--) N = O[L], N.skill_id == B && O.splice(L, 1);
                                if (O.length <= 0) F = y[0];
                                else {
                                    for (var W, R, K = !1, L = 0, M = O.length; M > L; L++) {
                                        W = O[L];
                                        for (var T in W.train_skill_alias)
                                            if (S = W.train_skill_alias[T]) {
                                                for (var U = 0, V = y.length; V > U; U++)
                                                    if (R = y[U], R.tooltipAlias == S) {
                                                        F = R, K = !0;
                                                        break
                                                    }
                                                if (K) break
                                            }
                                        if (K) break
                                    }
                                    K || (F = y[0])
                                }
                                G = nc.bns.training.Model.SKILL_OBJ_JSON[A.tooltip_alias], v(F, G, A)
                            }
                        } else {
                            y = nc.bns.training.Model.COLLECTION_ARRAY_HAS_SKILL_OBJ_JSON_BY_SKILL_ID[C], E = nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr(B);
                            for (var N, O = nc.bns.training.util.SearchDataUtil.getPrevTrainedSkillVariationObjs(nc.bns.training.Model.SLOT_OBJ_JSON[B], E.learnedSkillAlias), L = O.length - 1; L >= 0; L--) N = O[L], N.skill_id == B && O.splice(L, 1);
                            if (O.length <= 0) F = y[0];
                            else {
                                for (var W, R, K = !1, L = 0, M = O.length; M > L; L++) {
                                    W = O[L];
                                    for (var T in W.train_skill_alias)
                                        if (S = W.train_skill_alias[T]) {
                                            for (var U = 0, V = y.length; V > U; U++)
                                                if (R = y[U], R.tooltipAlias == S) {
                                                    F = R, K = !0;
                                                    break
                                                }
                                            if (K) break
                                        }
                                    if (K) break
                                }
                                K || (F = y[0])
                            }
                            G = nc.bns.training.Model.SKILL_OBJ_JSON[A.tooltip_alias], v(F, G, A)
                        }
                    }
                    break;
                case nc.bns.training.Model.SKILL_TYPE_SHARE:
                    switch (D) {
                    case "":
                        var X = nc.bns.training.Model.COLLECTION_ARRAY_HAS_SKILL_OBJ_JSON_BY_SKILL_ID[B];
                        y = nc.bns.training.Model.COLLECTION_ARRAY_HAS_SKILL_OBJ_JSON_BY_SKILL_ID[x.skill_id], X.length != y.length ? (y = X, _treeSkillObj = nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr(B), F = nc.bns.training.Model.SKILL_OBJ_JSON[E.learnedSkillTooltipAlias], G = nc.bns.training.Model.SKILL_OBJ_JSON[A.tooltip_alias], v(F, G, A)) : (_treeSkillObj = nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr(B), F = f(_treeSkillObj.learnedSkillTooltipAlias, y), G = f(A.tooltip_alias, y), w(F, G, x.skill_id), e(A), c(A));
                        break;
                    case nc.bns.training.Model.SLOT_REPLACE:
                        var X = nc.bns.training.Model.COLLECTION_ARRAY_HAS_SKILL_OBJ_JSON_BY_SKILL_ID[B];
                        y = nc.bns.training.Model.COLLECTION_ARRAY_HAS_SKILL_OBJ_JSON_BY_SKILL_ID[x.skill_id], X.length != y.length ? (y = X, _treeSkillObj = nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr(B), F = nc.bns.training.Model.SKILL_OBJ_JSON[E.learnedSkillTooltipAlias], G = nc.bns.training.Model.SKILL_OBJ_JSON[A.tooltip_alias], v(F, G, A)) : (_treeSkillObj = nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr(B), F = f(_treeSkillObj.learnedSkillTooltipAlias, y), G = f(A.tooltip_alias, y), w(F, G, x.skill_id), e(A), c(A));
                        break;
                    case nc.bns.training.Model.SLOT_ACQUISITION:
                        y = nc.bns.training.Model.COLLECTION_ARRAY_HAS_SKILL_OBJ_JSON_BY_SKILL_ID[C], E = nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr(B);
                        for (var N, O = nc.bns.training.util.SearchDataUtil.getPrevTrainedSkillVariationObjs(nc.bns.training.Model.SLOT_OBJ_JSON[B], E.learnedSkillAlias), L = O.length - 1; L >= 0; L--) N = O[L], N.skill_id == B && O.splice(L, 1);
                        if (O.length <= 0) F = y[0];
                        else {
                            var Y = O[0];
                            F = f(Y.tooltip_alias, y), F || (F = y[0])
                        }
                        G = nc.bns.training.Model.SKILL_OBJ_JSON[A.tooltip_alias], v(F, G, A)
                    }
                } else switch (x = nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr(nc.bns.training.Model.lastSelectedSkillListSkillId), x.skillType) {
                case "":
                    switch (D) {
                    case "":
                        u(B, A);
                        break;
                    case nc.bns.training.Model.SLOT_REPLACE:
                        u(B, A);
                        break;
                    case nc.bns.training.Model.SLOT_ACQUISITION:
                        u(C, A)
                    }
                    break;
                case nc.bns.training.Model.SKILL_TYPE_ACQUISITION:
                    switch (D) {
                    case "":
                        u(B, A);
                        break;
                    case nc.bns.training.Model.SLOT_REPLACE:
                        u(B, A);
                        break;
                    case nc.bns.training.Model.SLOT_ACQUISITION:
                        var Z = null;
                        if (x.skill_id != A.skill_id) {
                            y = nc.bns.training.Model.COLLECTION_ARRAY_HAS_SKILL_OBJ_JSON_BY_SKILL_ID[x.skill_id];
                            var _, S, K = !1;
                            for (var T in A.train_skill_alias)
                                if (S = A.train_skill_alias[T]) {
                                    for (var U = 0, V = y.length; V > U; U++)
                                        if (_ = y[U], _.tooltipAlias == S) {
                                            Z = _, K = !0;
                                            break
                                        }
                                    if (K) break
                                }
                            K ? (Z != y[0] ? (y = nc.bns.training.Model.COLLECTION_ARRAY_HAS_SKILL_OBJ_JSON_BY_SKILL_ID[x.skill_id], z = y[0], F = nc.bns.training.Model.SKILL_OBJ_JSON[b(z.tooltipAlias)], F || (F = nc.bns.training.Model.SKILL_OBJ_JSON[z.tooltipAlias]), G = Z) : (F = y[0], G = y[0]), w(F, G, x.skill_id), e(A), c(A)) : u(A.skill_id, A)
                        } else u(C, A)
                    }
                    break;
                case nc.bns.training.Model.SKILL_TYPE_SHARE:
                    switch (D) {
                    case "":
                        var X = nc.bns.training.Model.COLLECTION_ARRAY_HAS_SKILL_OBJ_JSON_BY_SKILL_ID[B];
                        y = nc.bns.training.Model.COLLECTION_ARRAY_HAS_SKILL_OBJ_JSON_BY_SKILL_ID[nc.bns.training.Model.lastSelectedSkillListSkillId], X.length != y.length ? (y = X, z = y[0], F = nc.bns.training.Model.SKILL_OBJ_JSON[b(z.tooltipAlias)], F || (F = nc.bns.training.Model.SKILL_OBJ_JSON[z.tooltipAlias]), G = f(A.tooltip_alias, y), G || (G = y[0]), w(F, G, B)) : (z = y[0], F = nc.bns.training.Model.SKILL_OBJ_JSON[b(z.tooltipAlias)], F || (F = nc.bns.training.Model.SKILL_OBJ_JSON[z.tooltipAlias]), G = f(A.tooltip_alias, y), G || (G = y[0]), w(F, G, x.skill_id)), e(A), c(A);
                        break;
                    case nc.bns.training.Model.SLOT_REPLACE:
                        y = nc.bns.training.Model.COLLECTION_ARRAY_HAS_SKILL_OBJ_JSON_BY_SKILL_ID[x.skill_id], z = y[0], F = nc.bns.training.Model.SKILL_OBJ_JSON[b(z.tooltipAlias)], F || (F = nc.bns.training.Model.SKILL_OBJ_JSON[z.tooltipAlias]), G = f(A.tooltip_alias, y), G || (G = y[0]), w(F, G, x.skill_id), e(A), c(A);
                        break;
                    case nc.bns.training.Model.SLOT_ACQUISITION:
                        u(C, A)
                    }
                }
            }

            function e() {
                var a = '<div class="tooltip"><section></section></div>';
                $(v).append(a);
                var b = $(".tooltip > section", v),
                    c = '<p class="tree_tp">Requires <span class="required_tp"></span> points</p>';
                b.append(c);
                var d = '<p class="consumed_sp"></p>';
                b.append(d);
                var e = '<dl><dt class="name"></dt><dd class="thumb"><img src="" class="icon"><span class="frame"></span></dd><dd class="main_info"><p class="main_info1"></p><p class="main_info2"></p></dd><dd class="sub_info"></dd></dl>';
                b.append(e);
                var f = '<div class="skill_info"><ul><li class="meter"><em>Range</em><div>From User</div></li><li class="range_0"><em>Area</em><div>3m</div></li><li class="casting_time"><em>Cast Time</em><div>Instant</div></li><li class="recycle_time"><em>Cooldown</em><div>24s</div></li></ul></div>';
                b.append(f);
                var g = '<div class="skill_acquire"><dl><dt>Activation Requirement</dt><dd></dd></dl></div>';
                b.append(g);
                var h = '<div class="skill_acquire"><dl><dt>Stance Change</dt><dd></dd></dl></div>';
                b.append(h);
                var i = '<div class="skill_acquire"><strong class="elit_skill_name"></strong><dl><dt>Acquire</dt><dd></dd></dl></div>';
                b.append(i);
                var j = '<div class="skill_acquire"><dl><dt></dt><dd></dd></dl></div>';
                b.append(j);
                var k = "<footer></footer>";
                b.append(k), o = new nc.bns.training.tooltip.DisplayTooltipDesc({
                    container: b
                }), p = new nc.bns.training.tooltip.DisplaySkillInfo({
                    container: $(".skill_info", v).get(0)
                }), r = new nc.bns.training.tooltip.DisplaySkillUseCondition({
                    container: $(".skill_acquire", v).get(0)
                }), q = new nc.bns.training.tooltip.DisplaySkillStanceRefine({
                    container: $(".skill_acquire", v).get(1)
                }), s = new nc.bns.training.tooltip.DisplaySkillAcquire({
                    container: $(".skill_acquire", v).get(2)
                }), t = new nc.bns.training.tooltip.DisplayAchievement({
                    container: $(".skill_acquire", v).get(3)
                }), u = new nc.bns.training.tooltip.DisplayRequiredTp({
                    container: $(".tree_tp", v)
                })
            }

            function f(a, b) {
                for (var c, d, e = null, f = a.replace(/\D*/g, ""), g = 0, h = b.length; h > g; g++)
                    if (c = b[g], d = c.tooltipAlias.replace(/\D*/g, ""), d == f) {
                        e = c;
                        break
                    }
                return e
            }
            var g = this,
                h = "Lv1",
                i = document.createElement("span");
            $(i).addClass("ui_skill_mod");
            var j = '<img src="../img/skill_ui_mod.png" height="13" width="35">',
                k = document.createElement("span");
            $(k).addClass("ui_skill_add");
            var l = '<img src="../img/skill_ui_add.png" height="13" width="35">',
                m = document.createElement("span");
            $(m).addClass("ui_skill_del");
            var n = "&#32";
            g.destroy = function () {}, g.displayDiffData = function (a) {
                d(a)
            }, g.setSkillToolTip = function (a) {
                function b(a) {
                    a.tooltip_stance_refine ? (q.displaySkillInfo(a.tooltip_stance_refine), q.displayStanceRefine(!0)) : q.displayStanceRefine(!1), a.tooltip_condition_refine ? (r.displaySkillInfo(a.tooltip_condition_refine), r.displayUseCondition(!0)) : r.displayUseCondition(!1), a.complete_achievement_name_refine ? (t.displaySkillInfo(a.complete_achievement_name_refine), t.displayUseCondition(!0)) : t.displayUseCondition(!1)
                }

                function d(a) {
                    a.tooltip_stance_refine ? (q.displaySkillInfo(a.tooltip_stance_refine), q.displayStanceRefine(!0)) : q.displayStanceRefine(!1), a.tooltip_condition_refine ? (r.displaySkillInfo(a.tooltip_condition_refine), r.displayUseCondition(!0)) : r.displayUseCondition(!1), a.complete_achievement_name_refine ? (t.displaySkillInfo(a.complete_achievement_name_refine), t.displayUseCondition(!0)) : t.displayUseCondition(!1)
                }

                function e(a) {
                    a.complete_quest_name_refine ? (a.complete_quest_desc_refine ? s.setEliteSkillInfo(String(a.complete_quest_name_refine), String(a.complete_quest_desc_refine)) : s.setLegendSkillInfo(String(a.complete_quest_name_refine)), s.displayAcquire(!0)) : s.displayAcquire(!1)
                }

                function g(a, b) {
                    o.displayDesc(b), p.displaySkillInfo(b);
                    var c = nc.bns.training.util.SearchDataUtil.getVariationObjHasVariationIdAndAlias(a.skill_id, String(a.learnedSkillVariationId), String(a.learnedSkillAlias));
                    c && (c.tooltip_stance_refine ? (q.displaySkillInfo(c.tooltip_stance_refine), q.displayStanceRefine(!0)) : q.displayStanceRefine(!1), c.tooltip_condition_refine ? (r.displaySkillInfo(c.tooltip_condition_refine), r.displayUseCondition(!0)) : r.displayUseCondition(!1), c.complete_achievement_name_refine ? (t.displaySkillInfo(c.complete_achievement_name_refine), t.displayUseCondition(!0)) : t.displayUseCondition(!1), c.complete_quest_name_refine ? (c.complete_quest_desc_refine ? s.setEliteSkillInfo(String(c.complete_quest_name_refine), String(c.complete_quest_desc_refine)) : s.setLegendSkillInfo(String(c.complete_quest_name_refine)), s.displayAcquire(!0)) : s.displayAcquire(!1))
                }
                var h, i, j = nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr(a);
                if (j.tree_id !== j.skill_id)
                    if (j.skillType != nc.bns.training.Model.SKILL_TYPE_NONE) {
                        var k = nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr(j.tree_id);
                        if (!k) return;
                        if ("" != k.learnedSkillTooltipAlias) switch (j.skillType) {
                        case nc.bns.training.Model.SKILL_TYPE_ACQUISITION:
                            for (var l, m = j.tree_id, n = nc.bns.training.util.SearchDataUtil.getPrevTrainedSkillVariationObjs(nc.bns.training.Model.SLOT_OBJ_JSON[m], k.learnedSkillAlias), v = n.length - 1; v >= 0; v--) l = n[v], l.skill_id == m && n.splice(v, 1);
                            if (n.length <= 0) {
                                i = nc.bns.training.Model.COLLECTION_ARRAY_HAS_SKILL_OBJ_JSON_BY_SKILL_ID[a], h = i[0], o.displayDesc(h), p.displaySkillInfo(h), b(j), s.displayAcquire(!1);
                                var w = nc.bns.training.util.SearchDataUtil.getVariationObjHasVariationIdAndAlias(k.tree_id, k.learnedSkillVariationId, k.learnedSkillAlias);
                                c(w)
                            } else {
                                i = nc.bns.training.Model.COLLECTION_ARRAY_HAS_SKILL_OBJ_JSON_BY_SKILL_ID[a];
                                for (var x, y, z = !1, v = 0, A = n.length; A > v; v++) {
                                    x = n[v];
                                    for (var B in x.train_skill_alias)
                                        if (trainSkillAliasStr = x.train_skill_alias[B], trainSkillAliasStr) {
                                            for (var C = 0, D = i.length; D > C; C++)
                                                if (y = i[C], y.tooltipAlias == trainSkillAliasStr) {
                                                    h = y, z = !0;
                                                    break
                                                }
                                            if (z) break
                                        }
                                    if (z) break
                                }
                                if (z)
                                    if (h != i[0]) {
                                        o.displayDesc(h), p.displaySkillInfo(h);
                                        var E = nc.bns.training.util.SearchDataUtil.getVariationObjHasVariationIdAndAlias(m, String(k.learnedSkillVariationId), String(k.learnedSkillAlias));
                                        E.tooltip_stance_refine ? (q.displaySkillInfo(E.tooltip_stance_refine), q.displayStanceRefine(!0)) : q.displayStanceRefine(!1), E.tooltip_condition_refine ? (r.displaySkillInfo(E.tooltip_condition_refine), r.displayUseCondition(!0)) : r.displayUseCondition(!1), E.complete_achievement_name_refine ? (t.displaySkillInfo(E.complete_achievement_name_refine), t.displayUseCondition(!0)) : t.displayUseCondition(!1), E.complete_quest_name_refine ? (E.complete_quest_desc_refine ? s.setEliteSkillInfo(String(E.complete_quest_name_refine), String(E.complete_quest_desc_refine)) : s.setLegendSkillInfo(String(E.complete_quest_name_refine)), s.displayAcquire(!0)) : s.displayAcquire(!1), c(E)
                                    } else {
                                        o.displayDesc(h), p.displaySkillInfo(h), b(j), s.displayAcquire(!1);
                                        var w = nc.bns.training.util.SearchDataUtil.getVariationObjHasVariationIdAndAlias(k.tree_id, k.learnedSkillVariationId, k.learnedSkillAlias);
                                        c(w)
                                    } else {
                                    h = i[0], o.displayDesc(h), p.displaySkillInfo(h), b(j), s.displayAcquire(!1);
                                    var F = nc.bns.training.util.SearchDataUtil.get1stVaridationObjHasTooltipAlias(m, j.skill_id, h.tooltipAlias);
                                    c(F)
                                }
                            }
                            break;
                        case nc.bns.training.Model.SKILL_TYPE_SHARE:
                            i = nc.bns.training.Model.COLLECTION_ARRAY_HAS_SKILL_OBJ_JSON_BY_SKILL_ID[a];
                            var G = nc.bns.training.Model.COLLECTION_ARRAY_HAS_SKILL_OBJ_JSON_BY_SKILL_ID[k.tree_id];
                            if (i.length != G.length) {
                                var F = nc.bns.training.util.SearchDataUtil.getVariationObjHasVariationIdAndAlias(k.tree_id, k.learnedSkillVariationId, k.learnedSkillAlias);
                                if (F.skill_id != j.skill_id) {
                                    i = nc.bns.training.Model.COLLECTION_ARRAY_HAS_SKILL_OBJ_JSON_BY_SKILL_ID[a], h = i[0], o.displayDesc(h), p.displaySkillInfo(h), b(j), s.displayAcquire(!1);
                                    var w = nc.bns.training.util.SearchDataUtil.getVariationObjHasVariationIdAndAlias(k.tree_id, k.learnedSkillVariationId, k.learnedSkillAlias);
                                    c(w)
                                } else F && (d(F), e(F), c(F))
                            } else {
                                h = f(k.learnedSkillTooltipAlias, i), h || (h = i[0]), g(j, h);
                                var H = nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr(a);
                                H && b(H);
                                var F = nc.bns.training.util.SearchDataUtil.getVariationObjHasVariationIdAndAlias(k.tree_id, k.learnedSkillVariationId, k.learnedSkillAlias);
                                F && e(F), c(F)
                            }
                        } else {
                            i = nc.bns.training.Model.COLLECTION_ARRAY_HAS_SKILL_OBJ_JSON_BY_SKILL_ID[a], h = i[0], o.displayDesc(h), p.displaySkillInfo(h), b(j), s.displayAcquire(!1);
                            var I = nc.bns.training.Model.SLOT_OBJ_JSON[String(j.tree_id)],
                                J = I[nc.bns.training.Model.FIRST_ITEM_SLOT_NO];
                            if (!J) return;
                            var K = J[1];
                            c(K)
                        }
                    } else {
                        var L = nc.bns.training.Model.COLLECTION_ARRAY_HAS_SKILL_OBJ_JSON_BY_SKILL_ID[j.skill_id];
                        h = L[0], o.displayDesc(h), p.displaySkillInfo(h), b(j), s.displayAcquire(!1), u.displayRequiredTp(!1)
                    } else {
                    i = nc.bns.training.Model.COLLECTION_ARRAY_HAS_SKILL_OBJ_JSON_BY_SKILL_ID[j.tree_id];
                    var M;
                    if ("" != j.learnedSkillTooltipAlias) {
                        if (h = nc.bns.training.Model.SKILL_OBJ_JSON[j.learnedSkillTooltipAlias], j.skill_id != h.id) {
                            for (var l, n = nc.bns.training.util.SearchDataUtil.getPrevTrainedSkillVariationObjs(nc.bns.training.Model.SLOT_OBJ_JSON[j.tree_id], j.learnedSkillAlias), v = n.length - 1; v >= 0; v--) l = n[v], l.skill_id != j.tree_id && n.splice(v, 1);
                            if (n.length <= 0) M = i[0];
                            else {
                                var N = n[0];
                                M = f(N.tooltip_alias, i), M || (M = i[0])
                            }
                        } else M = f(j.learnedSkillTooltipAlias, i);
                        g(j, M);
                        var F = nc.bns.training.util.SearchDataUtil.getVariationObjHasVariationIdAndAlias(j.tree_id, j.learnedSkillVariationId, j.learnedSkillAlias);
                        c(F)
                    } else i = nc.bns.training.Model.COLLECTION_ARRAY_HAS_SKILL_OBJ_JSON_BY_SKILL_ID[a], h = i[0], o.displayDesc(h), p.displaySkillInfo(h), b(j), s.displayAcquire(!1), u.displayRequiredTp(!1)
                }
            };
            var o, p, q, r, s, t, u, v = a.container;
            return e(), g
        }, nc.bns.training.tooltip.DisplayRequiredTp = function (a) {
            function b() {
                d = $(".required_tp", e)
            }
            var c = this;
            c.destroy = function () {}, c.displayRequiredTp = function (a) {
                a ? $(e).css("display", "block") : $(e).css("display", "none")
            }, c.setRequiredTp = function (a) {
                d.html(a)
            };
            var d, e = a.container;
            return b(), c
        }, nc.bns.training.tooltip.DisplaySkillStanceRefine = function (a) {
            function b() {
                d = $("> dl > dd", e)
            }
            var c = this;
            c.destroy = function () {}, c.displayStanceRefine = function (a) {
                a ? $(e).css("display", "block") : $(e).css("display", "none")
            }, c.displaySkillInfo = function (a) {
                d.html(a)
            };
            var d, e = a.container;
            return b(), c
        }, nc.bns.training.tooltip.DisplaySkillUseCondition = function (a) {
            function b() {
                d = $("> dl > dd", e)
            }
            var c = this;
            c.destroy = function () {}, c.displayUseCondition = function (a) {
                a ? $(e).css("display", "block") : $(e).css("display", "none")
            }, c.displaySkillInfo = function (a) {
                d.html(a)
            };
            var d, e = a.container;
            return b(), c
        }, nc.bns.training.tooltip.DisplayAchievement = function (a) {
            function b() {
                d = $("> dl > dd", e)
            }
            var c = this;
            c.destroy = function () {}, c.displayUseCondition = function (a) {
                a ? $(e).css("display", "block") : $(e).css("display", "none")
            }, c.displaySkillInfo = function (a) {
                d.html("");
                var b = '<img src="../img/achievement.png" />',
                    c = " <span> " + a + "</span>",
                    e = " achievement required";
                d.append($(b), $(c), e)
            };
            var d, e = a.container;
            return b(), c
        }, nc.bns.training.tooltip.DisplaySkillAcquire = function (a) {
            function b() {
                d = $(".elit_skill_name", h), e = $("> dl > dt", h), f = $("> dl > dd", h)
            }
            var c = this;
            c.destroy = function () {}, c.displayAcquire = function (a) {
                a ? $(h).css("display", "block") : $(h).css("display", "none")
            }, c.setEliteSkillInfo = function (a, b) {
                d.text(String(a)), e.text(g);
                var c = b.split("&#92;").join("");
                f.empty(), f.html(c)
            }, c.setLegendSkillInfo = function (a) {
                d.text(String(a)), e.text(""), f.empty()
            };
            var d, e, f, g = "Obtained from",
                h = a.container;
            return b(), c
        }, nc.bns.training.tooltip.DisplaySkillInfo = function (a) {
            function b() {
                l = $(".meter > div", u), m = $(".range_0", u), n = $(".range_0 > div", u), o = $(".casting_time > div", u), p = $(".recycle_time > div", u)
            }

            function c(a) {
                return a == s ? !0 : a == t ? !0 : !1
            }

            function d(a) {
                u.style.display = a ? "block" : "none"
            }

            function e(a) {
                var b = a ? a : "",
                    c = j(b);
                l.removeClass(), l.html(c)
            }

            function f(a) {
                var b = a.type,
                    d = a.value ? a.value : "";
                c(d) ? (d = t, m.removeClass()) : m.removeClass().addClass(b), n.removeClass(), $("div", m).text(d)
            }

            function g(a) {
                var b = a ? a : "";
                o.removeClass(), o.html(b)
            }

            function h(a) {
                var b = a ? a : "";
                p.removeClass(), p.html(b)
            }

            function i(a) {
                var b = a;
                for (var c in r)
                    if (c == b) {
                        b = r[c].value;
                        break
                    }
                return b
            }

            function j(a) {
                var b = a;
                for (var c in q)
                    if (c == b) {
                        b = q[c].value;
                        break
                    }
                return b
            }
            var k = this;
            k.destroy = function () {}, k.displaySkillInfoDiff = function (a, b) {
                var d = a.skill_info,
                    j = [];
                if (d)
                    for (var k in d) j.push(d[k]);
                var q = b.skill_info,
                    s = [];
                if (q)
                    for (var k in q) s.push(q[k]);
                if (j.length <= 0) s.length <= 0;
                else if (s.length <= 0);
                else {
                    if (String(j[0].value) != String(s[0].value) || String(j[0].type) != String(s[0].type)) {
                        var u = '<p class="range">' + i(String(j[0].value)) + '</p><p class="diff_arrow">▼</p><p class="ui_skill_mod">' + i(String(s[0].value)) + "</p>";
                        e(u), l.addClass("diff");
                        var v = r[String(j[0].value)];
                        if (v) {
                            var w = l.find(".range");
                            w.length && w.text() === v.value && w.addClass("small")
                        }
                        if (v = r[String(s[0].value)]) {
                            var x = l.find(".ui_skill_mod");
                            x.length && x.text() === v.value && x.addClass("small")
                        }
                    } else e(String(s[0].value));
                    if (String(j[1].value) != String(s[1].value) || String(j[1].type) != String(s[1].type)) {
                        var y = String(j[1].value),
                            z = String(s[1].value);
                        if (c(y) && c(z)) f(s[1]), n.removeClass("diff");
                        else {
                            m.removeClass(), n.addClass("diff"), c(y) && (y = t), c(z) && (z = t);
                            var u = '<p class="ui_skill_org">' + y + '</p><p class="diff_arrow">▼</p><p class="ui_skill_mod">' + z + "</p>";
                            n.html(u);
                            var A = String(j[1].type),
                                B = String(s[1].type),
                                C = $(".ui_skill_org", n).get(0),
                                D = $(".ui_skill_mod", n).get(0);
                            A != B ? y != t ? ($(C).addClass("range"), $(C).addClass(j[1].type), $(D).addClass("range"), $(D).addClass(s[1].type)) : m.removeClass().addClass(B) : m.removeClass().addClass(A)
                        }
                    } else f(s[1]), n.removeClass("diff");
                    if (String(j[2].value) != String(s[2].value) || String(j[2].type) != String(s[2].type)) {
                        var u = '<p class="range">' + String(j[2].value) + '</p><p class="diff_arrow">▼</p><p class="ui_skill_mod">' + String(s[2].value) + "</p>";
                        g(u), o.addClass("diff")
                    } else o.removeClass("diff"), g(String(s[2].value));
                    if (String(j[3].value) != String(s[3].value) || String(j[3].type) != String(s[3].type)) {
                        var u = '<p class="range">' + String(j[3].value) + '</p><p class="diff_arrow">▼</p><p class="ui_skill_mod">' + String(s[3].value) + "</p>";
                        h(u), p.addClass("diff")
                    } else h(String(s[3].value))
                }
            }, k.displaySkillInfo = function (a) {
                var b = a.skill_info,
                    c = [];
                for (var i in b) c.push(b[i]);
                c.length <= 0 ? d(!1) : (e(String(c[0].value)), f(c[1]), g(String(c[2].value)), h(String(c[3].value)), d(!0))
            };
            var l, m, n, o, p, q = {
                    "시전자 중심": {
                        value: "시전자<br/>중심"
                    }
                },
                r = {
                    "시전자 중심": {
                        value: "시전자중심"
                    }
                },
                s = "0m",
                t = "Target",
                u = a.container;
            return b(), k
        }, nc.bns.training.tooltip.DisplayTooltipDesc = function (a) {
            function b() {
                n = $(".consumed_sp", t), o = $(".name", t), p = $(".thumb > img", t).get(0), q = $(".main_info1", t), r = $(".main_info2", t), s = $(".sub_info", t)
            }

            function c(a, b) {
                n.text("");
                var c = parseInt(a.ui_sp_heal_value),
                    d = parseInt(b.ui_sp_heal_value),
                    e = parseInt(a.consume_sp),
                    f = parseInt(b.consume_sp),
                    g = "NONE";
                null != a.ui_sp_heal_value && (g = (parseInt(a.ui_sp_heal_value) > 0, "HEAL")), null != a.consume_sp && (g = (parseInt(a.consume_sp) > 0, "CONSUME"));
                var h = "NONE",
                    i = "";
                null != b.ui_sp_heal_value && (parseInt(b.ui_sp_heal_value) > 0 ? (i = k + b.ui_sp_heal_value, h = "HEAL") : h = "HEAL"), null != b.consume_sp && (parseInt(b.consume_sp) > 0 ? (i = l + b.consume_sp, h = "CONSUME") : h = "CONSUME"), 0 >= c && e > 0 && (g = "CONSUME"), c > 0 && 0 >= e && (g = "HEAL"), 0 >= d && f > 0 && (h = "CONSUME"), d > 0 && 0 >= f && (h = "HEAL");
                var j = "";
                switch (g) {
                case "NONE":
                    switch (h) {
                    case "HEAL":
                        j = k + d + " chi";
                        break;
                    case "CONSUME":
                        j = l + f + " chi";
                        break;
                    case "NONE":
                        j = ""
                    }
                    break;
                case "HEAL":
                    switch (h) {
                    case "HEAL":
                        j = c != d ? k + c + m + d + " chi" : 0 >= d ? "" + " chi" : k + d + " chi";
                        break;
                    case "CONSUME":
                        j = k + c + m + l + f + " chi";
                        break;
                    case "NONE":
                        j = k + c + m + "0" + " chi"
                    }
                    break;
                case "CONSUME":
                    switch (h) {
                    case "HEAL":
                        j = l + e + " chi" + m + k + d + " chi";
                        break;
                    case "CONSUME":
                        j = e != f ? l + e + m + f + " chi" : 0 >= f ? "" + " chi" : l + f + " chi";
                        break;
                    case "NONE":
                        j = l + e + m + "0" + " chi"
                    }
                }
                n.text(j)
            }

            function d(a) {
                if (n.text(""), null != a.ui_sp_heal_value) {
                    if (parseInt(a.ui_sp_heal_value) > 0) return void n.text(k + a.ui_sp_heal_value + " chi");
                    n.text("")
                }
                if (null != a.consume_sp) {
                    if (parseInt(a.consume_sp) > 0) return void n.text(l + a.consume_sp + " chi");
                    n.text("")
                }
            }

            function e(a) {
                var b = a ? a : "";
                o.text(b)
            }

            function f(a) {
                var b = a ? a : "";
                p.src = b
            }

            function g(a) {
                var b = a ? a : "";
                q.html(b)
            }

            function h(a) {
                var b = a ? a : "";
                r.html(b)
            }

            function i(a) {
                var b = a ? a : "";
                s.html(b)
            }
            var j = this;
            j.destroy = function () {}, j.setAllInfoByExternal = function (a, b, c) {
                g(a), h(b), i(c)
            }, j.setSkillNameByExternal = function (a) {
                e(a.name)
            }, j.setSkillThumbnailByExternal = function (a) {
                f(nc.bns.training.Model.SKILL_IMG_URL_FRONT + a.icon)
            }, j.setHealPointChangeDescByExternal = function (a, b) {
                c(a, b)
            };
            var k = "Generates ",
                l = "Costs ",
                m = " ▶ ";
            j.displayDesc = function (a) {
                d(a), e(a.name), f(nc.bns.training.Model.SKILL_IMG_URL_FRONT + a.icon), g(a.main_info1), h(a.main_info2), i(a.sub_info)
            };
            var n, o, p, q, r, s, t = a.container;
            return b(), j
        }, nc.bns.training.tree.Contents = function (a) {
            function b() {
                var a = '<div class="tree_tp"><span class="consumed_tp">' + nc.bns.training.Model.skillPointConsumed + '</span> / <span class="total_tp">' + nc.bns.training.Model.skillPointTotal + '</span></div><p class="only"><em></em> does not have a skill tree.</p>';
                $(j).append(a), m = $(".consumed_tp", j), n = $(".total_tp", j);
                var b = document.createElement("div");
                $(j).append(b);
                var d = $(".only").get(0);
                l = new nc.bns.training.tree.SkillTree({
                    container: b,
                    displayNoTrainingContainer: d
                }), $(l).bind(nc.bns.training.tree.SkillTree.CONSUME_SKILL_POINT, c), $(l).bind(nc.bns.training.tree.SkillTree.CANCEL_SKILL_POINT, c), $(l).bind(nc.bns.training.tree.SkillTree.MOUSEOVER_SLOT_ITEM, c), $(l).bind(nc.bns.training.tree.SkillTree.MOUSEOUT_SLOT_ITEM, c)
            }

            function c(a) {
                a.preventDefault(), a.stopPropagation();
                var b, c, d, e, f, g, h;
                switch (a.type) {
                case nc.bns.training.tree.SkillTree.CONSUME_SKILL_POINT:
                    b = a.skillId, c = a.treeId, d = a.prevTrainSkillIdArr, e = a.skillType, f = a.slotType, swtichSkillData = a.switchSkillData, g = a.variationData, h = a.required_tp, $(i).trigger({
                        type: nc.bns.training.tree.Contents.CONSUME_SKILL_POINT,
                        skillId: b,
                        treeId: c,
                        prevTrainSkillIdArr: d,
                        skillType: e,
                        slotType: f,
                        switchSkillData: swtichSkillData,
                        variationData: g,
                        required_tp: h
                    });
                    break;
                case nc.bns.training.tree.SkillTree.CANCEL_SKILL_POINT:
                    $(i).trigger({
                        type: nc.bns.training.tree.Contents.CANCEL_SKILL_POINT,
                        controlScrollContainerPosYSkillId: a.controlScrollContainerPosYSkillId,
                        flag_changeSkillName: a.flag_changeSkillName
                    });
                    break;
                case nc.bns.training.tree.SkillTree.MOUSEOVER_SLOT_ITEM:
                    $(i).trigger({
                        type: nc.bns.training.tree.Contents.MOUSEOVER_SLOT,
                        variationData: a.variationData,
                        skillType: a.skillType,
                        slotType: a.slotType
                    });
                    break;
                case nc.bns.training.tree.SkillTree.MOUSEOUT_SLOT_ITEM:
                    $(i).trigger({
                        type: nc.bns.training.tree.Contents.MOUSEOUT_SLOT,
                        variationData: a.variationData
                    })
                }
            }

            function d(a) {
                m && m.text(a)
            }

            function e(a) {
                n && n.text(a)
            }

            function f(a) {
                switch (nc.bns.training.Model.lastSelectedSkillType) {
                case nc.bns.training.Model.SKILL_TYPE_ACQUISITION:
                    var b = nc.bns.training.Model.SLOT_OBJ_JSON[a];
                    l.resetSkillTree(b, a);
                    break;
                case nc.bns.training.Model.SKILL_TYPE_SHARE:
                    var b = nc.bns.training.Model.SLOT_OBJ_JSON[a];
                    l.resetSkillTree(b, a)
                }
            }

            function g(a) {
                var b = nc.bns.training.Model.SLOT_OBJ_JSON[a];
                if (b) l.setSkillTree(b, a);
                else {
                    l.emptySkillTree();
                    for (var c = "", d = 0, e = k.length; e > d; d++)
                        if (tmpObj = k[d], tmpObj.skill_id == a) {
                            c = tmpObj.name2_refine_en;
                            break
                        }
                    l.displayNoSkillTreeDescription(c, a)
                }
            }

            function h(a) {
                var b = nc.bns.training.Model.SLOT_OBJ_JSON[a];
                if (b) l.resetSkillTree(b, a);
                else {
                    l.emptySkillTree();
                    for (var c = "", d = 0, e = k.length; e > d; d++)
                        if (tmpObj = k[d], tmpObj.skill_id == a) {
                            c = tmpObj.name2_refine_en;
                            break
                        }
                    l.displayNoSkillTreeDescription(c, a)
                }
            }
            var i = this;
            i.destroy = function () {
                l && ($(l).unbind(nc.bns.training.tree.SkillTree.CONSUME_SKILL_POINT, c), $(l).unbind(nc.bns.training.tree.SkillTree.CANCEL_SKILL_POINT, c), l.destroy(), l = null)
            }, i.resetSkillTreeBySkillId = function (a) {
                h(a)
            }, i.setSkillTree = function (a) {
                g(a)
            }, i.setTreeIdSkillTree = function (a, b) {
                f(a, b)
            }, i.displaySkillPointConsumedByExternal = function (a) {
                d(a)
            }, i.displaySkillPointTotalByExternal = function (a) {
                e(a)
            };
            var j = a.container,
                k = a.objArr,
                l = null,
                m = null,
                n = null;
            return b(), i
        }, nc.bns.training.tree.Contents.CONSUME_SKILL_POINT = "CONSUME_SKILL_POINT", nc.bns.training.tree.Contents.CANCEL_SKILL_POINT = "CANCEL_SKILL_POINT", nc.bns.training.tree.Contents.MOUSEOVER_SLOT = "MOUSEOVER_SLOT", nc.bns.training.tree.Contents.MOUSEOUT_SLOT = "MOUSEOUT_SLOT", nc.bns.training.tree.SkillTree = function (a) {
            function b() {
                c(!1)
            }

            function c(a) {
                a ? $(s).css("display", "block") : $(s).css("display", "none")
            }

            function d(a) {
                if (t) {
                    t.text(a);
                    var b = nc.bns.training.Model.NO_TRAINING_DESC.charAt(0),
                        c = nc.bns.training.util.StringUtil.getFixedPostPositionStr(a, b),
                        d = t.get(0),
                        e = d.nextSibling,
                        f = $(e).text(),
                        g = c + f.substr(1, f.length - 1);
                    e.nodeValue = g
                }
            }

            function e() {
                $(r).empty(), $(r).removeClass(), q && (q.destroy(), q = null), f(), v = []
            }

            function f() {
                for (var a, b = 0, c = v.length; c > b; b++) a = v[b], i(a, nc.bns.training.tree.SkillSlotItem.CLICK_SKILL_SLOT_ITEM, l), i(a, nc.bns.training.tree.SkillSlotItem.CLICK_MOUSE_RIGHT_BUTTON, l), a.destroy();
                v = []
            }

            function g(a, b) {
                for (var c = nc.bns.training.util.ObjectUtil.getElementKeyNameArr(a), d = [], e = [], g = 0, i = c.length; i > g; g++) tmpNo = String(c[g]), d.push(parseInt(tmpNo.charAt(0))), e.push(parseInt(tmpNo.charAt(1)));
                var m = (nc.bns.training.util.ArrayUtil.getMaxNumberByArr(d), nc.bns.training.util.ArrayUtil.getMaxNumberByArr(e));
                $(r).addClass("tree_cols" + m);
                var n = '<div class="tree_arrow"></div>';
                $(r).append(n), q = nc.bns.training.tree.ArrowManager({
                    container: $(".tree_arrow", r).get(0),
                    data: a
                }), f(), v = [];
                for (var p, s, t, u = 0, i = c.length; i > u; u++) s = c[u], t = document.createElement("div"), $(t).addClass("slot_" + s), $(r).append(t), p = new nc.bns.training.tree.SkillSlotItem({
                    container: t,
                    slotNo: s,
                    data: a[s]
                }), $(p).bind(nc.bns.training.tree.SkillSlotItem.MOUSEOVER_SKILL_SLOT_ITEM, k), $(p).bind(nc.bns.training.tree.SkillSlotItem.MOUSEOUT_SKILL_SLOT_ITEM, k), v.push(p);
                var w = nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr(b);
                if (w)
                    if ("" != w.learnedSkillVariationId)
                        if (o()) {
                            var x, y;
                            for (var z in a) {
                                x = a[z];
                                for (var A in x)
                                    if (y = x[A], w.learnedSkillAlias == y.alias && w.learnedSkillVariationId == y.variation_id) {
                                        for (var B, C, D, E = j(z), F = q.getConnectionArrTotal(), G = !1, g = 0, i = F.length; i > g; g++) {
                                            C = F[g];
                                            var H = nc.bns.training.util.ArrayUtil.indexOf(C, E.getSlotNo());
                                            if (G = H >= 0 ? !0 : !1);
                                            else
                                                for (var I = 0, J = C.length; J > I; I++) D = C[I], B = j(D), B.getSlotFrameType() != nc.bns.training.tree.SkillSlotItem.TYPE_FRAME_LEGEND ? B.setSlotStatus(nc.bns.training.tree.SkillSlotItem.STATUS_EXCLUSIVE) : B.setMouseInteraction(!1)
                                        }
                                        var K = q.activateArrowsFromRootToSlotAndGetArrowInfoObj(z);
                                        if (parseInt(A) >= parseInt(y.max_variation_level)) {
                                            nc.bns.training.Model.editable && q.activateArrowsFromSlotToChildSlots(z);
                                            for (var p, L = q.getNextSkillItemsBySelectedSlotNo(z), g = 0, i = v.length; i > g; g++) {
                                                p = v[g];
                                                for (var u = 0, M = L.length; M > u; u++) {
                                                    var N = L[u];
                                                    if (p.getSlotNo() == N)
                                                        if (p.getSlotFrameType() != nc.bns.training.tree.SkillSlotItem.TYPE_FRAME_LEGEND) {
                                                            if (nc.bns.training.Model.editable) {
                                                                var O = a[N][1];
                                                                O.required_tp <= nc.bns.training.Model.skillPointRemained ? (p.setSlotStatus(nc.bns.training.tree.SkillSlotItem.STATUS_PLUS), h(p, nc.bns.training.tree.SkillSlotItem.CLICK_SKILL_SLOT_ITEM, l)) : p.setSlotStatus(nc.bns.training.tree.SkillSlotItem.STATUS_IMPOSSIBLE)
                                                            }
                                                        } else p.setMouseInteraction(!1)
                                                }
                                            }
                                            E.setSlotStatus(nc.bns.training.tree.SkillSlotItem.STATUS_COMPLETE), h(E, nc.bns.training.tree.SkillSlotItem.CLICK_MOUSE_RIGHT_BUTTON, l)
                                        } else {
                                            E.setCurrentVariationStatus(parseInt(A)), E.displayVariationStatus(A);
                                            var P = a[z][String(parseInt(A) + 1)];
                                            P.required_tp <= nc.bns.training.Model.skillPointRemained ? (E.setSlotStatus(nc.bns.training.tree.SkillSlotItem.STATUS_PLUS_STEP), h(E, nc.bns.training.tree.SkillSlotItem.CLICK_SKILL_SLOT_ITEM, l), h(E, nc.bns.training.tree.SkillSlotItem.CLICK_MOUSE_RIGHT_BUTTON, l)) : (h(E, nc.bns.training.tree.SkillSlotItem.CLICK_MOUSE_RIGHT_BUTTON, l), E.setSlotStatus(nc.bns.training.tree.SkillSlotItem.STATUS_IMPOSSIBLE), E.setSlotStatus(nc.bns.training.tree.SkillSlotItem.STATUS_PLUS_STEP))
                                        }
                                        for (var Q, B, g = 0, i = K.length; i > g; g++) Q = K[g], B = j(Q.prevTrainSlotNo), B.setSlotStatus(nc.bns.training.tree.SkillSlotItem.STATUS_COMPLETE)
                                    }
                            }
                        } else {
                            var x, y;
                            for (var z in a) {
                                x = a[z];
                                for (var A in x)
                                    if (y = x[A], w.learnedSkillAlias == y.alias && w.learnedSkillVariationId == y.variation_id) {
                                        for (var B, C, D, E = j(z), F = q.getConnectionArrTotal(), G = !1, g = 0, i = F.length; i > g; g++) {
                                            C = F[g];
                                            var H = nc.bns.training.util.ArrayUtil.indexOf(C, E.getSlotNo());
                                            if (G = H >= 0 ? !0 : !1);
                                            else
                                                for (var I = 0, J = C.length; J > I; I++) D = C[I], B = j(D), B.getSlotFrameType() != nc.bns.training.tree.SkillSlotItem.TYPE_FRAME_LEGEND ? B.setSlotStatus(nc.bns.training.tree.SkillSlotItem.STATUS_EXCLUSIVE) : B.setMouseInteraction(!1)
                                        }
                                        for (var B, C, D, F = q.getConnectionArrTotal(), G = !1, g = 0, i = F.length; i > g; g++) {
                                            C = F[g];
                                            var H = nc.bns.training.util.ArrayUtil.indexOf(C, E.getSlotNo());
                                            if (G = H >= 0 ? !0 : !1)
                                                for (var I = 0, J = C.length; J > I; I++) D = C[I], B = j(D), B.getSlotFrameType() != nc.bns.training.tree.SkillSlotItem.TYPE_FRAME_LEGEND ? B.setSlotStatus(nc.bns.training.tree.SkillSlotItem.STATUS_IMPOSSIBLE) : B.setMouseInteraction(!1)
                                        }
                                        var K = q.activateArrowsFromRootToSlotAndGetArrowInfoObj(z);
                                        parseInt(A) >= parseInt(y.max_variation_level) ? (E.setSlotStatus(nc.bns.training.tree.SkillSlotItem.STATUS_COMPLETE), h(E, nc.bns.training.tree.SkillSlotItem.CLICK_MOUSE_RIGHT_BUTTON, l)) : (E.setCurrentVariationStatus(parseInt(A)), E.displayVariationStatus(A), E.setSlotStatus(nc.bns.training.tree.SkillSlotItem.STATUS_PLUS_STEP), h(E, nc.bns.training.tree.SkillSlotItem.CLICK_SKILL_SLOT_ITEM, l), h(E, nc.bns.training.tree.SkillSlotItem.CLICK_MOUSE_RIGHT_BUTTON, l));
                                        for (var Q, B, g = 0, i = K.length; i > g; g++) Q = K[g], B = j(Q.prevTrainSlotNo), B.setSlotStatus(nc.bns.training.tree.SkillSlotItem.STATUS_COMPLETE)
                                    }
                            }
                        } else if (o()) {
                    var R = j(nc.bns.training.Model.FIRST_ITEM_SLOT_NO);
                    if (!R) return;
                    if (nc.bns.training.Model.editable) {
                        var S = a[nc.bns.training.Model.FIRST_ITEM_SLOT_NO][1];
                        S.required_tp <= nc.bns.training.Model.skillPointRemained ? (R.setSlotStatus(nc.bns.training.tree.SkillSlotItem.STATUS_PLUS), h(R, nc.bns.training.tree.SkillSlotItem.CLICK_SKILL_SLOT_ITEM, l)) : R.setSlotStatus(nc.bns.training.tree.SkillSlotItem.STATUS_IMPOSSIBLE)
                    }
                } else
                    for (var B, g = 0, i = v.length; i > g; g++) switch (B = v[g], B.getSlotFrameType()) {
                    case nc.bns.training.tree.SkillSlotItem.TYPE_FRAME_NORMAL:
                        B.setSlotStatus(nc.bns.training.tree.SkillSlotItem.STATUS_IMPOSSIBLE);
                        break;
                    case nc.bns.training.tree.SkillSlotItem.TYPE_FRAME_LEGEND:
                        break;
                    case nc.bns.training.tree.SkillSlotItem.TYPE_FRAME_ELITE:
                        B.setSlotStatus(nc.bns.training.tree.SkillSlotItem.STATUS_IMPOSSIBLE)
                    }
            }

            function h(a, b, c) {
                $(a).unbind(b, c), $(a).bind(b, c)
            }

            function i(a, b, c) {
                $(a).unbind(b, c)
            }

            function j(a) {
                for (var b = null, c = 0, d = v.length; d > c && (b = v[c], b.getSlotNo() != a); c++);
                return b
            }

            function k(a) {
                a.preventDefault(), a.stopPropagation();
                var b = "",
                    c = "",
                    d = null,
                    e = null;
                switch (a.type) {
                case nc.bns.training.tree.SkillSlotItem.MOUSEOUT_SKILL_SLOT_ITEM:
                    d = a.variationData, $(p).trigger({
                        type: nc.bns.training.tree.SkillTree.MOUSEOUT_SLOT_ITEM,
                        variationData: d
                    });
                    break;
                case nc.bns.training.tree.SkillSlotItem.MOUSEOVER_SKILL_SLOT_ITEM:
                    if (e = a.target, !e) return;
                    switch (b = a.variationData.skill_id, c = a.variationData.tree_id, d = a.variationData, nc.bns.training.Model.lastSelectedSkillType) {
                    case "":
                        skillListObj = nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr(c), $(p).trigger(b != c ? {
                            type: nc.bns.training.tree.SkillTree.MOUSEOVER_SLOT_ITEM,
                            variationData: d,
                            skillType: "",
                            slotType: nc.bns.training.Model.SLOT_ACQUISITION
                        } : skillListObj.name2_refine != a.variationData.name2_refine ? {
                            type: nc.bns.training.tree.SkillTree.MOUSEOVER_SLOT_ITEM,
                            variationData: d,
                            skillType: "",
                            slotType: nc.bns.training.Model.SLOT_REPLACE
                        } : {
                            type: nc.bns.training.tree.SkillTree.MOUSEOVER_SLOT_ITEM,
                            variationData: d,
                            skillType: "",
                            slotType: ""
                        });
                        break;
                    case nc.bns.training.Model.SKILL_TYPE_ACQUISITION:
                        skillListObj = nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr(c), $(p).trigger(b != c ? {
                            type: nc.bns.training.tree.SkillTree.MOUSEOVER_SLOT_ITEM,
                            variationData: d,
                            skillType: nc.bns.training.Model.SKILL_TYPE_ACQUISITION,
                            slotType: nc.bns.training.Model.SLOT_ACQUISITION
                        } : skillListObj.name2_refine != a.variationData.name2_refine ? {
                            type: nc.bns.training.tree.SkillTree.MOUSEOVER_SLOT_ITEM,
                            variationData: d,
                            skillType: nc.bns.training.Model.SKILL_TYPE_ACQUISITION,
                            slotType: nc.bns.training.Model.SLOT_REPLACE
                        } : {
                            type: nc.bns.training.tree.SkillTree.MOUSEOVER_SLOT_ITEM,
                            variationData: d,
                            skillType: nc.bns.training.Model.SKILL_TYPE_ACQUISITION,
                            slotType: ""
                        });
                        break;
                    case nc.bns.training.Model.SKILL_TYPE_SHARE:
                        skillListObj = nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr(c), $(p).trigger(b != c ? {
                            type: nc.bns.training.tree.SkillTree.MOUSEOVER_SLOT_ITEM,
                            variationData: d,
                            skillType: nc.bns.training.Model.SKILL_TYPE_SHARE,
                            slotType: nc.bns.training.Model.SLOT_ACQUISITION
                        } : skillListObj.name2_refine != a.variationData.name2_refine ? {
                            type: nc.bns.training.tree.SkillTree.MOUSEOVER_SLOT_ITEM,
                            variationData: d,
                            skillType: nc.bns.training.Model.SKILL_TYPE_SHARE,
                            slotType: nc.bns.training.Model.SLOT_REPLACE
                        } : {
                            type: nc.bns.training.tree.SkillTree.MOUSEOVER_SLOT_ITEM,
                            variationData: d,
                            skillType: nc.bns.training.Model.SKILL_TYPE_SHARE,
                            slotType: ""
                        })
                    }
                }
            }

            function l(a) {
                function b(a, b) {
                    for (var c, d, g, k, n = q.getConnectionArrTotal(), o = !1, p = 0, r = n.length; r > p; p++)
                        if (c = n[p], d = nc.bns.training.util.ArrayUtil.indexOf(c, f), o = d >= 0 ? !0 : !1)
                            for (var s, t = parseInt(f.charAt(0)), u = 0, w = c.length; w > u; u++) g = c[u], k = j(g), s = parseInt(g.charAt(0)), t > s && (i(k, nc.bns.training.tree.SkillSlotItem.CLICK_MOUSE_RIGHT_BUTTON, l), i(k, nc.bns.training.tree.SkillSlotItem.CLICK_SKILL_SLOT_ITEM, l));
                        else
                            for (var u = 0, w = c.length; w > u; u++) g = c[u], k = j(g), i(k, nc.bns.training.tree.SkillSlotItem.CLICK_MOUSE_RIGHT_BUTTON, l), i(k, nc.bns.training.tree.SkillSlotItem.CLICK_SKILL_SLOT_ITEM, l), k.getSlotFrameType() != nc.bns.training.tree.SkillSlotItem.TYPE_FRAME_LEGEND ? k.setSlotStatus(nc.bns.training.tree.SkillSlotItem.STATUS_EXCLUSIVE) : k.setMouseInteraction(!1);
                    var x = q.activateArrowsFromRootToSlotAndGetArrowInfoObj(f);
                    if (q.activateArrowsFromSlotToChildSlots(f), e.addVariationStatusValue(), m(e), e.getFlagRemainVariation()) {
                        var y = a[e.getSlotNo()][String(parseInt(e.getCurrentVariationStatus()) + 1)];
                        y.required_tp <= b ? (e.setSlotStatus(nc.bns.training.tree.SkillSlotItem.STATUS_PLUS_STEP), h(e, nc.bns.training.tree.SkillSlotItem.CLICK_SKILL_SLOT_ITEM, l), h(e, nc.bns.training.tree.SkillSlotItem.CLICK_MOUSE_RIGHT_BUTTON, l)) : (i(e, nc.bns.training.tree.SkillSlotItem.CLICK_MOUSE_RIGHT_BUTTON, l), i(e, nc.bns.training.tree.SkillSlotItem.CLICK_SKILL_SLOT_ITEM, l), e.setSlotStatus(nc.bns.training.tree.SkillSlotItem.STATUS_IMPOSSIBLE), e.setSlotStatus(nc.bns.training.tree.SkillSlotItem.STATUS_PLUS_STEP)), q.deactivateArrowsFromSlotToChildSlots(f)
                    } else
                        for (var z, A = q.getNextSkillItemsBySelectedSlotNo(f), p = 0, r = v.length; r > p; p++) {
                            z = v[p];
                            for (var B = 0, C = A.length; C > B; B++) {
                                var D = A[B];
                                if (z.getSlotNo() == D)
                                    if (z.getSlotFrameType() != nc.bns.training.tree.SkillSlotItem.TYPE_FRAME_LEGEND) {
                                        var E = a[D][1];
                                        E.required_tp <= b ? (z.setSlotStatus(nc.bns.training.tree.SkillSlotItem.STATUS_PLUS), h(z, nc.bns.training.tree.SkillSlotItem.CLICK_SKILL_SLOT_ITEM, l)) : z.setSlotStatus(nc.bns.training.tree.SkillSlotItem.STATUS_IMPOSSIBLE)
                                    } else z.setMouseInteraction(!1)
                            }
                        }
                    for (var F, k, p = 0, r = x.length; r > p; p++) F = x[p], k = j(F.prevTrainSlotNo), k.setSlotStatus(nc.bns.training.tree.SkillSlotItem.STATUS_COMPLETE);
                    h(e, nc.bns.training.tree.SkillSlotItem.CLICK_MOUSE_RIGHT_BUTTON, l)
                }

                function c() {
                    for (var a, b, c, d, g = q.getConnectionArrTotal(), k = !1, n = 0, o = g.length; o > n; n++)
                        if (a = g[n], b = nc.bns.training.util.ArrayUtil.indexOf(a, e.getSlotNo()), k = b >= 0 ? !0 : !1);
                        else
                            for (var p = 0, r = a.length; r > p; p++) c = a[p], d = j(c), i(d, nc.bns.training.tree.SkillSlotItem.CLICK_MOUSE_RIGHT_BUTTON, l), i(d, nc.bns.training.tree.SkillSlotItem.CLICK_SKILL_SLOT_ITEM, l), d.getSlotFrameType() != nc.bns.training.tree.SkillSlotItem.TYPE_FRAME_LEGEND ? d.setSlotStatus(nc.bns.training.tree.SkillSlotItem.STATUS_EXCLUSIVE) : d.setMouseInteraction(!1);
                    for (var a, b, k = !1, n = 0, o = g.length; o > n; n++)
                        if (a = g[n], b = nc.bns.training.util.ArrayUtil.indexOf(a, e.getSlotNo()), k = b >= 0 ? !0 : !1)
                            for (var c, d, p = 0, r = a.length; r > p; p++) c = a[p], d = j(c), i(d, nc.bns.training.tree.SkillSlotItem.CLICK_MOUSE_RIGHT_BUTTON, l), i(d, nc.bns.training.tree.SkillSlotItem.CLICK_SKILL_SLOT_ITEM, l), d.getSlotFrameType() != nc.bns.training.tree.SkillSlotItem.TYPE_FRAME_LEGEND ? d.setSlotStatus(nc.bns.training.tree.SkillSlotItem.STATUS_IMPOSSIBLE) : d.setMouseInteraction(!1);
                    var s = q.activateArrowsFromRootToSlotAndGetArrowInfoObj(f);
                    q.activateArrowsFromSlotToChildSlots(f), e.addVariationStatusValue(), m(e), e.getFlagRemainVariation() && q.deactivateArrowsFromSlotToChildSlots(f);
                    for (var t, d, n = 0, o = s.length; o > n; n++) t = s[n], d = j(t.prevTrainSlotNo), d.setSlotStatus(nc.bns.training.tree.SkillSlotItem.STATUS_COMPLETE);
                    h(e, nc.bns.training.tree.SkillSlotItem.CLICK_MOUSE_RIGHT_BUTTON, l)
                }
                a.preventDefault(), a.stopPropagation();
                var d = {
                        type: null
                    },
                    e = null,
                    f = "",
                    g = null,
                    k = "",
                    o = "",
                    r = null;
                switch (a.type) {
                case nc.bns.training.tree.SkillSlotItem.CLICK_SKILL_SLOT_ITEM:
                    if (e = a.target, !e) return;
                    if (nc.bns.training.Model.skillPointRemained <= 0) return;
                    switch (f = e.getSlotNo(), k = a.variationData.skill_id, o = a.variationData.tree_id, r = a.variationData, nc.bns.training.Model.lastSelectedSkillType) {
                    case "":
                        var s = nc.bns.training.util.SearchDataUtil.getPrevTrainedAllSkillId(nc.bns.training.Model.SLOT_OBJ_JSON[o], r.alias);
                        g = nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr(o), g.learnedSkillVariationId = String(r.variation_id), g.learnedSkillTooltipAlias = String(r.tooltip_alias), g.learnedSkillAlias = String(r.alias);
                        var t = nc.bns.training.Model.skillPointRemained - r.required_tp;
                        0 >= t ? c() : b(nc.bns.training.Model.SLOT_OBJ_JSON[o], t), k != o ? $(p).trigger({
                            type: nc.bns.training.tree.SkillTree.CONSUME_SKILL_POINT,
                            skillId: k,
                            treeId: o,
                            prevTrainSkillIdArr: s,
                            skillType: "",
                            slotType: nc.bns.training.Model.SLOT_ACQUISITION,
                            switchSkillData: null,
                            variationData: r,
                            required_tp: parseInt(r.required_tp)
                        }) : g.name2_refine != a.variationData.name2_refine ? (d = {
                            variationId: g.learnedSkillVariationId,
                            alias: g.learnedSkillAlias,
                            skillName: r.name2_refine
                        }, $(p).trigger({
                            type: nc.bns.training.tree.SkillTree.CONSUME_SKILL_POINT,
                            skillId: k,
                            treeId: o,
                            prevTrainSkillIdArr: s,
                            skillType: "",
                            slotType: nc.bns.training.Model.SLOT_REPLACE,
                            switchSkillData: d,
                            variationData: r,
                            required_tp: parseInt(r.required_tp)
                        })) : $(p).trigger({
                            type: nc.bns.training.tree.SkillTree.CONSUME_SKILL_POINT,
                            skillId: k,
                            treeId: o,
                            prevTrainSkillIdArr: s,
                            skillType: "",
                            slotType: "",
                            switchSkillData: null,
                            variationData: r,
                            required_tp: parseInt(r.required_tp)
                        });
                        break;
                    case nc.bns.training.Model.SKILL_TYPE_ACQUISITION:
                        var s = nc.bns.training.util.SearchDataUtil.getPrevTrainedAllSkillId(nc.bns.training.Model.SLOT_OBJ_JSON[o], r.alias);
                        g = nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr(o), g.learnedSkillVariationId = String(r.variation_id), g.learnedSkillTooltipAlias = String(r.tooltip_alias), g.learnedSkillAlias = String(r.alias);
                        var t = nc.bns.training.Model.skillPointRemained - r.required_tp;
                        0 >= t ? c() : b(nc.bns.training.Model.SLOT_OBJ_JSON[o], t), k != o ? $(p).trigger({
                            type: nc.bns.training.tree.SkillTree.CONSUME_SKILL_POINT,
                            skillId: k,
                            treeId: o,
                            prevTrainSkillIdArr: s,
                            skillType: nc.bns.training.Model.SKILL_TYPE_ACQUISITION,
                            slotType: nc.bns.training.Model.SLOT_ACQUISITION,
                            switchSkillData: null,
                            variationData: r,
                            required_tp: parseInt(r.required_tp)
                        }) : g.name2_refine != a.variationData.name2_refine ? (d = {
                            variationId: g.learnedSkillVariationId,
                            alias: g.learnedSkillAlias,
                            skillName: r.name2_refine
                        }, $(p).trigger({
                            type: nc.bns.training.tree.SkillTree.CONSUME_SKILL_POINT,
                            skillId: k,
                            treeId: o,
                            prevTrainSkillIdArr: s,
                            skillType: nc.bns.training.Model.SKILL_TYPE_ACQUISITION,
                            slotType: nc.bns.training.Model.SLOT_REPLACE,
                            switchSkillData: d,
                            variationData: r,
                            required_tp: parseInt(r.required_tp)
                        })) : $(p).trigger({
                            type: nc.bns.training.tree.SkillTree.CONSUME_SKILL_POINT,
                            skillId: k,
                            treeId: o,
                            prevTrainSkillIdArr: s,
                            skillType: nc.bns.training.Model.SKILL_TYPE_ACQUISITION,
                            slotType: "",
                            switchSkillData: null,
                            variationData: r,
                            required_tp: parseInt(r.required_tp)
                        });
                        break;
                    case nc.bns.training.Model.SKILL_TYPE_SHARE:
                        var s = nc.bns.training.util.SearchDataUtil.getPrevTrainedAllSkillId(nc.bns.training.Model.SLOT_OBJ_JSON[o], r.alias);
                        g = nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr(o), g.learnedSkillVariationId = String(a.variationData.variation_id), g.learnedSkillTooltipAlias = String(a.variationData.tooltip_alias), g.learnedSkillAlias = String(a.variationData.alias);
                        var t = nc.bns.training.Model.skillPointRemained - r.required_tp;
                        0 >= t ? c() : b(nc.bns.training.Model.SLOT_OBJ_JSON[o], t), k != o ? $(p).trigger({
                            type: nc.bns.training.tree.SkillTree.CONSUME_SKILL_POINT,
                            skillId: k,
                            treeId: o,
                            prevTrainSkillIdArr: s,
                            skillType: nc.bns.training.Model.SKILL_TYPE_SHARE,
                            slotType: nc.bns.training.Model.SLOT_ACQUISITION,
                            switchSkillData: null,
                            variationData: r,
                            required_tp: parseInt(r.required_tp)
                        }) : g.name2_refine != a.variationData.name2_refine ? (d = {
                            variationId: g.learnedSkillVariationId,
                            alias: g.learnedSkillAlias,
                            skillName: r.name2_refine
                        }, $(p).trigger({
                            type: nc.bns.training.tree.SkillTree.CONSUME_SKILL_POINT,
                            skillId: k,
                            treeId: o,
                            prevTrainSkillIdArr: s,
                            skillType: nc.bns.training.Model.SKILL_TYPE_SHARE,
                            slotType: nc.bns.training.Model.SLOT_REPLACE,
                            switchSkillData: d,
                            variationData: r,
                            required_tp: parseInt(r.required_tp)
                        })) : $(p).trigger({
                            type: nc.bns.training.tree.SkillTree.CONSUME_SKILL_POINT,
                            skillId: k,
                            treeId: o,
                            prevTrainSkillIdArr: s,
                            skillType: nc.bns.training.Model.SKILL_TYPE_SHARE,
                            slotType: "",
                            switchSkillData: null,
                            variationData: r,
                            required_tp: parseInt(r.required_tp)
                        })
                    }
                    break;
                case nc.bns.training.tree.SkillSlotItem.CLICK_MOUSE_RIGHT_BUTTON:
                    var e = a.target;
                    if (!e) return;
                    f = e.getSlotNo();
                    var r = a.prevVariationData,
                        u = r.required_tp;
                    k = r.skill_id, o = r.tree_id;
                    var w, x = !1,
                        y = "";
                    switch (nc.bns.training.Model.lastSelectedSkillType) {
                    case "":
                        y = o;
                    case nc.bns.training.Model.SKILL_TYPE_ACQUISITION:
                        y = o;
                    case nc.bns.training.Model.SKILL_TYPE_SHARE:
                        y = o, w = nc.bns.training.Model.SLOT_OBJ_JSON[o], g = nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr(o);
                        var z = n(o, g.learnedSkillAlias);
                        if (z.length <= 0) return;
                        for (var A, B = -1, C = 0, D = z.length; D > C; C++)
                            if (A = z[C], A.variation_id == r.variation_id && A.alias == r.alias) {
                                B = C;
                                break
                            }
                        if (0 > B) return;
                        if (0 === B) g.name2_refine != g.initName2Refine && (x = !0), g.learnedSkillVariationId = "", g.learnedSkillTooltipAlias = "", g.learnedSkillAlias = "", g.name2_refine = g.initName2Refine, g.initJamoStr = nc.bns.training.util.StringUtil.getInitialJamoStr(g.name2_refine.charAt(0), nc.bns.training.Model.SORT_NAME_ARR), g.consumedSkillPoint = 0;
                        else {
                            var E = z[B - 1];
                            if (g.name2_refine != E.name2_refine) {
                                var F = nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr(E.skill_id);
                                x = "" != F.skillType ? !1 : !0
                            }
                            if (g.learnedSkillVariationId = String(E.variation_id), g.learnedSkillTooltipAlias = String(E.tooltip_alias), g.learnedSkillAlias = String(E.alias), g.name2_refine = E.name2_refine, g.initJamoStr = nc.bns.training.util.StringUtil.getInitialJamoStr(E.name2_refine.charAt(0), nc.bns.training.Model.SORT_NAME_ARR), g.consumedSkillPoint <= 0) return;
                            g.consumedSkillPoint = g.consumedSkillPoint - u
                        }
                    }
                    $(p).trigger({
                        type: nc.bns.training.tree.SkillTree.CANCEL_SKILL_POINT,
                        controlScrollContainerPosYSkillId: y,
                        flag_changeSkillName: x
                    })
                }
            }

            function m(a) {
                var b = a;
                b.learnSkill(), b.setSlotStatus(b.getFlagRemainVariation() ? nc.bns.training.tree.SkillSlotItem.STATUS_PLUS_STEP : nc.bns.training.tree.SkillSlotItem.STATUS_COMPLETE)
            }

            function n(a) {
                var b, c, d = [],
                    e = nc.bns.training.Model.SLOT_OBJ_JSON[a],
                    f = nc.bns.training.util.SearchDataUtil.getSkillListObjFromCustomGlobalModelArr(a),
                    g = f.learnedSkillVariationId,
                    h = f.learnedSkillAlias,
                    i = !1,
                    j = -1;
                for (var k in e) {
                    b = e[k];
                    for (var l in b)
                        if (c = b[l], c.variation_id == g) {
                            c.alias == h && (j = k, i = !0);
                            break
                        }
                    if (i) break
                }
                if (!(0 > j)) {
                    var m, n, o = q.getConnectionArrTotalBySkillId(a),
                        p = !1;
                    if (o.length <= 0) {
                        p = !0, m = [];
                        for (var k in e) m.push(String(k))
                    } else
                        for (var r = 0, s = o.length; s > r && !p; r++) {
                            m = o[r];
                            for (var t = 0, u = m.length; u > t; t++)
                                if (n = m[t], n == j) {
                                    p = !0;
                                    break
                                }
                        }
                    for (var n, v, w, x = !1, r = 0, s = m.length; s > r && !x; r++) {
                        n = m[r], v = e[String(n)];
                        for (var y in v)
                            if (w = v[y], d.push(w), w.variation_id == g) {
                                w.alias == h && (x = !0);
                                break
                            }
                    }
                    return d
                }
            }

            function o() {
                var a = !1;
                return nc.bns.training.Model.skillPointRemained > 0 && (a = !0), a
            }
            var p = this;
            p.destroy = function () {}, p.resetSkillTree = function (a, b) {
                c(!1), e(), g(a, b), u = String(b)
            }, p.setSkillTree = function (a, b) {
                u != String(b) && (c(!1), e(), g(a, b), u = String(b))
            }, p.emptySkillTree = function () {
                $(r).empty(), $(r).removeClass()
            }, p.displayNoSkillTreeDescription = function (a, b) {
                e(), u = b, d(a), c(!0)
            };
            var q, r = a.container,
                s = a.displayNoTrainingContainer,
                t = $("em", s),
                u = "",
                v = [];
            return b(), p
        }, nc.bns.training.tree.SkillTree.CONSUME_SKILL_POINT = "CONSUME_SKILL_POINT", nc.bns.training.tree.SkillTree.CANCEL_SKILL_POINT = "CANCEL_SKILL_POINT", nc.bns.training.tree.SkillTree.SWITCH_SKILL_TYPE_REPLACE = "SWITCH_SKILL_TYPE_REPLACE", nc.bns.training.tree.SkillTree.MOUSEOVER_SLOT_ITEM = "MOUSEOVER_SLOT_ITEM", nc.bns.training.tree.SkillTree.MOUSEOUT_SLOT_ITEM = "MOUSEOUT_SLOT_ITEM", nc.bns.training.tree.ArrowManager = function (a) {
            function b() {
                var a = nc.bns.training.util.ObjectUtil.getElementKeyNameArr(p),
                    b = nc.bns.training.util.ObjectUtil.getElementArr(p);
                r = [];
                for (var f, g = 0, h = b.length; h > g; g++) f = b[g][1], f.slotNo = a[g], r.push(f);
                q = [];
                for (var i, j, k, g = r.length - 1; g >= 0; g--) f = r[g], i = f.prev_train[0], i && (j = e(p, i), k = d(o, j, f.slotNo), q.push(k));
                var l = [];
                l = $.extend(!0, l, q), c(l, q, !0)
            }

            function c(a, b, d) {
                if (d) {
                    if (a.length <= 0) return;
                    t = [];
                    var e = a[0];
                    t.unshift(e.slotNo), t.unshift(e.prevTrainSlotNo), a.shift()
                }
                for (var f, g, h = !1, i = t[0], j = 0, k = b.length; k > j; j++)
                    if (f = b[j], i == f.slotNo) {
                        if (t.unshift(f.prevTrainSlotNo), h = !0, a.length > 0)
                            for (var l = 0, m = a.length; m > l; l++)
                                if (g = a[l], i == g.slotNo) {
                                    nc.bns.training.util.ArrayUtil.removeElement(a, g);
                                    break
                                }
                        break
                    }
                h ? c(a, b, !1) : (s.push(t), c(a, b, !0))
            }

            function d(a, b, c) {
                var d = String(b).charAt(0),
                    f = String(b).charAt(1),
                    o = String(c).charAt(0),
                    q = String(c).charAt(1),
                    s = document.createElement("span");
                $(s).addClass("arrow"), $(a).append(s), $(s).append('<span class="end"></span><span class="h"></span><span class="v"></span>');
                var t, u, v, w, x, y, z = $(".v", s).get(0),
                    A = $(".h", s).get(0),
                    B = $(".end", s).get(0);
                if (f != q) {
                    t = parseInt(o) - parseInt(d), u = parseInt(q) - parseInt(f);
                    for (var C, D, E, F = [], G = 0, H = r.length; H > G; G++)
                        if (C = r[G], C.slotNo != c) {
                            if (D = C.prev_train[0], !D) continue;
                            E = e(p, D), E == b && F.push(C)
                        }
                    if (F.length > 0) {
                        for (var I, J, G = 0, H = F.length; H > G && (I = F[G], J = String(I.slotNo).charAt(1), f != J); G++);
                        var K = String(I.slotNo).charAt(0);
                        if (parseInt(o) <= parseInt(K)) v = parseInt(d - 1) * i + g, w = parseInt(f - 1) * j + h, y = 1 >= t ? k - l : t * i - m - l, z.style.top = v + "px", z.style.left = w + "px", z.style.width = n + "px", z.style.height = y + "px", x = u * j, A.style.height = n + "px", A.style.top = v + y + "px", A.style.left = w + "px", A.style.width = x + 2 + "px", B.style.top = parseInt(A.style.top) + "px", B.style.left = w + x - 3 + "px";
                        else {
                            var L = parseInt(K) - d;
                            v = parseInt(d - 1) * i + g, w = parseInt(f - 1) * j + h, y = 1 >= L ? k - l : L * i - m - l, z.style.top = v + "px", z.style.left = w + "px", z.style.width = n + "px", z.style.height = y + "px", x = u * j, A.style.height = n + "px", A.style.top = v + y + "px", A.style.left = w + "px", A.style.width = x + "px";
                            var M = document.createElement("span");
                            $(M).addClass("v"), s.appendChild(M);
                            var N = o - parseInt(K);
                            y = N * i, M.style.top = parseInt(A.style.top) + "px", M.style.left = w + x + "px", M.style.width = n + "px", M.style.height = y + "px", B.style.top = parseInt(A.style.top) + y + "px", B.style.left = w + x - 3 + "px"
                        }
                    } else v = parseInt(d - 1) * i + g, w = parseInt(f - 1) * j + h, y = 1 >= t ? k - l : t * i - m - l, z.style.top = v + "px", z.style.left = w + "px", z.style.width = n + "px", z.style.height = y + "px", x = u * j, A.style.height = n + "px", A.style.top = v + y + "px", A.style.left = w + "px", A.style.width = x + "px", B.style.top = parseInt(A.style.top) + "px", B.style.left = w + x - 3 + "px"
                } else t = parseInt(o) - parseInt(d), v = parseInt(d - 1) * i + g, w = parseInt(f - 1) * j + h, y = 1 >= t ? k - l : t * i - m - l, z.style.top = v + "px", z.style.left = w + "px", z.style.width = n + "px", z.style.height = y + 2 + "px", A.style.display = "none", B.style.left = w - 3 + "px", B.style.top = parseInt(z.style.top) + parseInt(z.style.height) + "px";
                var O = {
                    container: s,
                    prevTrainSlotNo: String(b),
                    slotNo: String(c)
                };
                return O
            }

            function e(a, b) {
                var c, d;
                for (var e in a) {
                    c = a[e];
                    for (var f in c)
                        if (d = c[f], d.alias == b) return e
                }
                return -1
            }
            var f = this;
            f.destroy = function () {
                $(o).empty(), arrowDataObjArr = []
            }, f.getConnectionArrTotal = function () {
                return s
            }, f.activateArrowsFromSlotToChildSlots = function (a) {
                for (var b, c = a, d = [], e = 0, f = q.length; f > e; e++) b = q[e], b.prevTrainSlotNo == c && d.push(b.container);
                for (var g, h = 0, f = d.length; f > h; h++) g = d[h], $(g).addClass("able");
                for (var i, j = !1, e = 0, f = q.length; f > e; e++)
                    if (i = q[e], i.slotNo == a) {
                        j = !0;
                        break
                    }
                if (j) {
                    d = [];
                    for (var e = 0, f = q.length; f > e; e++) b = q[e], b.slotNo != a && b.prevTrainSlotNo == i.prevTrainSlotNo && d.push(b.container);
                    for (var h = 0, f = d.length; f > h; h++) g = d[h], $(g).removeClass("able")
                }
            }, f.deactivateArrowsFromSlotToChildSlots = function (a) {
                arrowContainerArr = [];
                for (var b = 0, c = q.length; c > b; b++) arrowInfoObj = q[b], arrowInfoObj.prevTrainSlotNo == a && arrowContainerArr.push(arrowInfoObj.container);
                for (var d = 0, c = arrowContainerArr.length; c > d; d++) _arrowElement = arrowContainerArr[d], $(_arrowElement).removeClass("able")
            }, f.activateArrowsFromRootToSlotAndGetArrowInfoObj = function (a) {
                var b = a,
                    c = [],
                    d = {};
                d.setArrowContainerArr = function (a, b, c) {
                    for (var d, e = !1, f = 0, g = q.length; g > f; f++)
                        if (d = q[f], d.slotNo == b) {
                            e = !0, c.push(d);
                            break
                        }
                    if (e) {
                        var h = parseInt(d.prevTrainSlotNo.charAt(0));
                        if (1 >= h) return
                    }
                    if (c.length > 0) {
                        var i = c[c.length - 1];
                        a.setArrowContainerArr(a, i.prevTrainSlotNo, c)
                    }
                }, d.setArrowContainerArr(d, b, c);
                for (var e, f = 0, g = c.length; g > f; f++) e = c[f].container, $(e).addClass("able");
                return c
            }, f.getNextSkillItemsBySelectedSlotNo = function (a) {
                for (var b, c = a, d = [], e = 0, f = q.length; f > e; e++) b = q[e], b.prevTrainSlotNo == c && d.push(b.slotNo);
                return d
            }, f.getConnectionArrTotal = function () {
                return s
            }, f.getConnectionArrTotalBySkillId = function (a) {
                for (var b, c = [], d = nc.bns.training.Model.SLOT_OBJ_JSON[String(a)], f = nc.bns.training.util.ObjectUtil.getElementKeyNameArr(d), g = nc.bns.training.util.ObjectUtil.getElementArr(d), h = [], i = 0, j = g.length; j > i; i++) b = g[i][1], b.slotNo = f[i], h.push(b);
                for (var k, l, m, n = [], i = h.length - 1; i >= 0; i--) b = h[i], k = b.prev_train[0], k && (l = e(d, k), m = {
                    prevTrainSlotNo: String(l),
                    slotNo: String(b.slotNo)
                }, n.push(m));
                var o = [],
                    p = {};
                p.setArrowConnectionArr = function (a, b, d, e) {
                    if (e) {
                        if (b.length <= 0) return;
                        o = [];
                        var f = b[0];
                        o.unshift(f.slotNo), o.unshift(f.prevTrainSlotNo), b.shift()
                    }
                    for (var g, h, i = !1, j = o[0], k = 0, l = d.length; l > k; k++)
                        if (g = d[k], j == g.slotNo) {
                            if (o.unshift(g.prevTrainSlotNo), i = !0, b.length > 0)
                                for (var m = 0, n = b.length; n > m; m++)
                                    if (h = b[m], j == h.slotNo) {
                                        nc.bns.training.util.ArrayUtil.removeElement(b, h);
                                        break
                                    }
                            break
                        }
                    i ? a.setArrowConnectionArr(a, b, d, !1) : (c.push(o), a.setArrowConnectionArr(a, b, d, !0))
                };
                var q = [];
                return q = $.extend(!0, q, n), p.setArrowConnectionArr(p, q, n, !0), c
            };
            var g = 60,
                h = 32,
                i = 75,
                j = 75,
                k = 25,
                l = 17,
                m = 50,
                n = 5,
                o = a.container,
                p = a.data,
                q = [],
                r = [],
                s = [],
                t = [];
            return b(), f
        }, nc.bns.training.tree.SkillSlotItem = function (a) {
            function b() {
                q = nc.bns.training.util.ObjectUtil.getElementArr(n);
                var a = "",
                    b = q[p];
                if (b) {
                    b.training_icon && (a = nc.bns.training.Model.SKILL_IMG_URL_FRONT + b.training_icon), o = q.length, r = q[p];
                    var d = '<div class="slot"><span class="thumb"><img src="' + a + '"></span><span class="frame"></span><span class="hover"></span><span class="step">' + p + "/" + o + "</span></div>";
                    $(l).append(d), s = $(".slot", l), r.complete_quest_name_refine && (r.complete_quest_desc_refine ? (u = nc.bns.training.tree.SkillSlotItem.TYPE_FRAME_ELITE, v = "slot elite") : (u = nc.bns.training.tree.SkillSlotItem.TYPE_FRAME_LEGEND, v = "slot elite_legend")), r.complete_achievement_name_refine && (u = nc.bns.training.tree.SkillSlotItem.TYPE_FRAME_ACHIEVEMENT, v = "slot achievement"), h(u), c(!0)
                }
            }

            function c(a) {
                s.unbind("mouseover", d), s.unbind("mouseout", d), a && (s.bind("mouseover", d), s.bind("mouseout", d))
            }

            function d(a) {
                switch (a.preventDefault(), a.type) {
                case "mouseover":
                    e();
                    break;
                case "mouseout":
                    $(k).trigger(q.length > 1 ? {
                        type: nc.bns.training.tree.SkillSlotItem.MOUSEOUT_SKILL_SLOT_ITEM,
                        variationData: q[p]
                    } : {
                        type: nc.bns.training.tree.SkillSlotItem.MOUSEOUT_SKILL_SLOT_ITEM,
                        variationData: r
                    })
                }
            }

            function e() {
                if (q.length > 1) {
                    var a = q[p];
                    a || (a = q[q.length - 1]), $(k).trigger({
                        type: nc.bns.training.tree.SkillSlotItem.MOUSEOVER_SKILL_SLOT_ITEM,
                        variationData: a
                    })
                } else $(k).trigger({
                    type: nc.bns.training.tree.SkillSlotItem.MOUSEOVER_SKILL_SLOT_ITEM,
                    variationData: r
                })
            }

            function f(a) {
                var b = $(".step", s);
                b.text(a + "/" + o)
            }

            function g(a) {
                switch (a) {
                case nc.bns.training.tree.SkillSlotItem.STATUS_DEFAULT:
                    x = !1;
                    break;
                case nc.bns.training.tree.SkillSlotItem.STATUS_PLUS:
                    s.removeClass().addClass(v).addClass("plus"), i(!0), x = !1;
                    break;
                case nc.bns.training.tree.SkillSlotItem.STATUS_PLUS_STEP:
                    s.removeClass().addClass(v).addClass("plusstep"), i(!0), x = !1;
                    break;
                case nc.bns.training.tree.SkillSlotItem.STATUS_COMPLETE:
                    s.removeClass().addClass(v).addClass("complete"), i(!0), p = o, f(p), w = "", x = !0;
                    break;
                case nc.bns.training.tree.SkillSlotItem.STATUS_IMPOSSIBLE:
                    s.removeClass().addClass(v), i(!0), w = "impossible", x = !1;
                    break;
                case nc.bns.training.tree.SkillSlotItem.STATUS_EXCLUSIVE:
                    s.removeClass().addClass(v), i(!0), w = "exclusive", x = !1
                }
                t = a
            }

            function h(a) {
                switch (a) {
                case nc.bns.training.tree.SkillSlotItem.TYPE_FRAME_NORMAL:
                    u = nc.bns.training.tree.SkillSlotItem.TYPE_FRAME_NORMAL, v = "slot";
                    break;
                case nc.bns.training.tree.SkillSlotItem.TYPE_FRAME_LEGEND:
                    s.addClass("elite_legend"), u = nc.bns.training.tree.SkillSlotItem.TYPE_FRAME_LEGEND, v = "slot elite_legend";
                    break;
                case nc.bns.training.tree.SkillSlotItem.TYPE_FRAME_ELITE:
                    s.addClass("elite"), u = nc.bns.training.tree.SkillSlotItem.TYPE_FRAME_ELITE, v = "slot elite";
                    break;
                case nc.bns.training.tree.SkillSlotItem.TYPE_FRAME_ACHIEVEMENT:
                    s.addClass("achievement"), u = nc.bns.training.tree.SkillSlotItem.TYPE_FRAME_ACHIEVEMENT, v = "slot achievement"
                }
            }

            function i(a) {
                nc.bns.training.Model.editable && (s.css("cursor", "auto"), s.unbind("mouseover", j), s.unbind("mouseout", j), s.unbind("mousedown", j), s.unbind("touchstart", j), s.unbind("touchend", j), s.unbind("click", j), s.unbind("contextmenu", j), a && (s.css("cursor", "pointer"), s.bind("mouseover", j), s.bind("mouseout", j), s.bind("mousedown", j), s.bind("touchstart", j), s.bind("touchend", j), s.bind("click", j), s.bind("contextmenu", j)))
            }

            function j(a) {
                switch (a.preventDefault(), a.stopPropagation(), a.type) {
                case "touchstart":
                    s.addClass(w);
                    break;
                case "touchend":
                    if (x) {
                        if (0 >= p) return;
                        var b = 0;
                        0 >= b && (b = 0);
                        var c = q[b];
                        $(k).trigger({
                            type: nc.bns.training.tree.SkillSlotItem.CLICK_MOUSE_RIGHT_BUTTON,
                            prevVariationData: c
                        })
                        return;
                    }
                    if (nc.bns.training.Model.skillPointRemained <= 0) return;
                    r = q[p], $(k).trigger({
                        type: nc.bns.training.tree.SkillSlotItem.CLICK_SKILL_SLOT_ITEM,
                        variationData: r
                    }), e();
                    break;
                case "mouseover":
                    if (!w) return;
                    s.addClass(w);
                    break;
                case "mouseout":
                    if (!w) return;
                    s.removeClass(w);
                    break;
                case "mousedown":
                    break;
                case "click":
                    if (x) return;
                    if (nc.bns.training.Model.skillPointRemained <= 0) return;
                    r = q[p], $(k).trigger({
                        type: nc.bns.training.tree.SkillSlotItem.CLICK_SKILL_SLOT_ITEM,
                        variationData: r
                    }), e();
                    break;
                case "contextmenu":
                    if (0 >= p) return;
                    var b = p - 1;
                    0 >= b && (b = 0);
                    var c = q[b];
                    $(k).trigger({
                        type: nc.bns.training.tree.SkillSlotItem.CLICK_MOUSE_RIGHT_BUTTON,
                        prevVariationData: c
                    })
                }
            }
            var k = this;
            k.destroy = function () {
                c(!1), o = 1, q = [], p = 0, r = null, u = nc.bns.training.tree.SkillSlotItem.TYPE_FRAME_NORMAL, v = "slot"
            }, k.getSlotFrameType = function () {
                return u
            }, k.setSlotStatus = function (a) {
                g(a)
            }, k.setFrameType = function (a) {
                h(a)
            }, k.getSlotStatus = function () {
                return t
            }, k.setCurrentVariationStatus = function (a) {
                p = parseInt(a)
            }, k.getCurrentVariationStatus = function () {
                return p
            }, k.displayVariationStatus = function (a) {
                f(a)
            }, k.getVariationTotal = function () {
                return o
            }, k.getSlotNo = function () {
                return m
            }, k.setMouseInteraction = function (a) {
                i(a)
            }, k.getFlagRemainVariation = function () {
                var a = !0;
                return p >= o && (a = !1), a
            }, k.addVariationStatusValue = function () {
                p >= o || p++
            }, k.subtractVariationStatusValue = function () {
                0 >= p || p--
            }, k.learnSkill = function () {
                p >= o || f(p)
            }, k.cancelSkill = function () {
                0 >= p || f(p)
            }, k.getCurrentVariationPcLevel = function () {
                return parseInt(r.pc_level)
            }, k.getCurrentVariationName2Refine = function () {
                return r.name2_refine
            }, k.getCurrentVariationRequiredTp = function () {
                return r.required_tp
            };
            var l = a.container,
                m = a.slotNo,
                n = a.data,
                o = 1,
                p = 0,
                q = [],
                r = null,
                s = null,
                t = nc.bns.training.tree.SkillSlotItem.STATUS_DEFAULT,
                u = nc.bns.training.tree.SkillSlotItem.TYPE_FRAME_NORMAL,
                v = "slot",
                w = "",
                x = !1;
            return b(), k
        }, nc.bns.training.tree.SkillSlotItem.STATUS_DEFAULT = "STATUS_DEFAULT", nc.bns.training.tree.SkillSlotItem.STATUS_PLUS = "STATUS_PLUS", nc.bns.training.tree.SkillSlotItem.STATUS_PLUS_STEP = "STATUS_PLUS_STEP", nc.bns.training.tree.SkillSlotItem.STATUS_COMPLETE = "STATUS_COMPLETE", nc.bns.training.tree.SkillSlotItem.STATUS_IMPOSSIBLE = "STATUS_IMPOSSIBLE", nc.bns.training.tree.SkillSlotItem.STATUS_EXCLUSIVE = "STATUS_EXCLUSIVE", nc.bns.training.tree.SkillSlotItem.CLICK_SKILL_SLOT_ITEM = "CLICK_SKILL_SLOT_ITEM", nc.bns.training.tree.SkillSlotItem.CLICK_MOUSE_RIGHT_BUTTON = "CLICK_MOUSE_RIGHT_BUTTON", nc.bns.training.tree.SkillSlotItem.TYPE_FRAME_LEGEND = "TYPE_FRAME_LEGEND", nc.bns.training.tree.SkillSlotItem.TYPE_FRAME_ELITE = "TYPE_FRAME_ELITE", nc.bns.training.tree.SkillSlotItem.TYPE_FRAME_ACHIEVEMENT = "TYPE_FRAME_ACHIEVEMENT", nc.bns.training.tree.SkillSlotItem.TYPE_FRAME_NORMAL = "TYPE_FRAME_NORMAL", nc.bns.training.tree.SkillSlotItem.MOUSEOVER_SKILL_SLOT_ITEM = "MOUSEOVER_SKILL_SLOT_ITEM", nc.bns.training.tree.SkillSlotItem.MOUSEOUT_SKILL_SLOT_ITEM = "MOUSEOUT_SKILL_SLOT_ITEM"
    }(jQuery);