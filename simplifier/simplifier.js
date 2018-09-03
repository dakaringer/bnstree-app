var test = [];

function list(v, l) {
	for(var key in v) {
		if (v.hasOwnProperty(key)) {
			l[l.length] = key.toLowerCase();
		}
	}
}

function list2(v, w, x, l) {
	var lx = [];
	
	for(var skill in v) {
		if (v.hasOwnProperty(skill)) {
			for(var variation in v[skill]){
				for(var step in v[skill][variation]){
					lx[lx.length] = v[skill][variation][step]["skill_id"];
				}
			}
		}
	}
	
	for(var id in x) {
		if (v.hasOwnProperty(skill)) {
			lx[lx.length] = id;
		}
	}
	
	for(var key in w) {
		if (w.hasOwnProperty(key)) {
			if ($.inArray(w[key]["id"], lx) == -1) {
				l[l.length] = key.toLowerCase();
			}
		}
	}
}

function arr_diff(a1, a2)
{
  var a=[], diff=[];
  for(var i=0;i<a1.length;i++)
    a[a1[i]]=true;
  for(var i=0;i<a2.length;i++)
    if(a[a2[i]]) delete a[a2[i]];
    else a[a2[i]]=true;
  for(var k in a)
    diff.push(k);
  return diff;
}

function simplify(skill_data){
	var l1 = [];
	var l2 = [];
	var l3 = [];
	var new_data = JSON.parse(JSON.stringify(data_skill_tooltip));
	var final_st = "";
	
	console.log(data_skill_tooltip);
	
	list(data_skill_tooltip, l1);
	list(skill_data, l2);
	
	l3 = arr_diff(l1, l2);
	
	for (var t in new_data){
		if (new_data.hasOwnProperty(t)) {
			if ($.inArray(t.toLowerCase(), l3) > -1){
				delete new_data[t]
			}
			// else {
				// for (var group in new_data[t]) {
					// for (var n in new_data[t][group]){
						// delete new_data[t][group][n]["default-text-refine"];
						// delete new_data[t][group][n]["is_public"];
						// delete new_data[t][group][n]["skill-modify-diff-repeat-count"];
						// delete new_data[t][group][n]["after-stance-attribute"];
						// delete new_data[t][group][n]["before-stance-attribute"];
					// }
				// }
			// }
		}
	}
	
	final_st =  "var data_skill_tooltip = " + JSON.stringify(new_data);
	return final_st;
}

function simplify2(skill_data, slot_data, category_data){
	var l1 = [];
	var new_data = skill_data;
	var final_st = "";
	
	list2(slot_data, skill_data, category_data, l1);
	
	for (var t in new_data){
		if (new_data.hasOwnProperty(t)) {
			if ($.inArray(t.toLowerCase(), l1) > -1){
				delete new_data[t]
			}
		}
	}
	
	return new_data;
}

function simplify_all(){	
	var new_skill_AS;
	var new_skill_BM;
	var new_skill_DE;
	var new_skill_FM;
	var new_skill_KF;
	var new_skill_SM;
	var new_skill_SU;
	var new_skill_WL;
	
	new_skill_AS = simplify2(skill_data_AS, slot_data_AS, category_data_AS);
	document.getElementById("t_AS").value = simplify(new_skill_AS);
	document.getElementById("s_AS").value = "var skill_data_AS = " + JSON.stringify(new_skill_AS);
	
	new_skill_BM = simplify2(skill_data_BM, slot_data_BM, category_data_BM);
	document.getElementById("t_BM").value = simplify(new_skill_BM);
	document.getElementById("s_BM").value = "var skill_data_BM = " + JSON.stringify(new_skill_BM);
	
	new_skill_DE = simplify2(skill_data_DE, slot_data_DE, category_data_DE);
	document.getElementById("t_DE").value = simplify(new_skill_DE);
	document.getElementById("s_DE").value = "var skill_data_DE = " + JSON.stringify(new_skill_DE);
	
	new_skill_FM = simplify2(skill_data_FM, slot_data_FM, category_data_FM);
	document.getElementById("t_FM").value = simplify(new_skill_FM);
	document.getElementById("s_FM").value = "var skill_data_FM = " + JSON.stringify(new_skill_FM);
	
	new_skill_KF = simplify2(skill_data_KF, slot_data_KF, category_data_KF);
	document.getElementById("t_KF").value = simplify(new_skill_KF);
	document.getElementById("s_KF").value = "var skill_data_KF = " + JSON.stringify(new_skill_KF);
	
	new_skill_SM = simplify2(skill_data_SM, slot_data_SM, category_data_SM);
	document.getElementById("t_SM").value = simplify(new_skill_SM);
	document.getElementById("s_SM").value = "var skill_data_SM = " + JSON.stringify(new_skill_SM);
	
	new_skill_SU = simplify2(skill_data_SU, slot_data_SU, category_data_SU);
	document.getElementById("t_SU").value = simplify(new_skill_SU);
	document.getElementById("s_SU").value = "var skill_data_SU = " + JSON.stringify(new_skill_SU);
	
	new_skill_WL = simplify2(skill_data_WL, slot_data_WL, category_data_WL);
	document.getElementById("t_WL").value = simplify(new_skill_WL);
	document.getElementById("s_WL").value = "var skill_data_WL = " + JSON.stringify(new_skill_WL);
}