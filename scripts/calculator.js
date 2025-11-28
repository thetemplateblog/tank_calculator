function CalcFormInit() {
    
  var SaveTankSize = getCookie("SaveTankSize");
  // if the cookie isn't found
  if (!SaveTankSize) {
    document.inputform.tanksize.value = 100;
  }
  else document.inputform.tanksize.value = SaveTankSize;

  var SaveAmountH2O = getCookie("SaveAmountH2O");
  // if the cookie isn't found
  if (!SaveAmountH2O) {
    document.inputform.amount_H2O.value = 1;
  }
  else document.inputform.amount_H2O.value = SaveAmountH2O;
 
  var SaveAmountSoln = getCookie("SaveAmountSoln");
  // if the cookie isn't found
  if (!SaveAmountSoln) {
    document.inputform.amount_soln.value = 1;
  }
  else document.inputform.amount_soln.value = SaveAmountSoln;

  var SaveTankUnits = getCookie("SaveTankUnits");
  // if the cookie isn't found
  if (!SaveTankUnits) {
    document.inputform.TankSizeUnits[0].checked = 1;
  }
  else {
    document.inputform.TankSizeUnits[SaveTankUnits].checked = 1;
  }
 
  var SaveNutUnits= getCookie("SaveNutUnits");
  // if the cookie isn't found
  if (!SaveNutUnits) {
    document.inputform.NutrientUnits[0].checked = 1;
  }
  else {
    document.inputform.NutrientUnits[SaveNutUnits].checked = 1;
  }

  document.inputform.mixppm.value ="";
  document.inputform.amount_chem.value ="";
  
}
  
function GetNutrientName(ChemNum) {
  var NutrientName = new Array('Potassium','Nitrate','Potassium','Phosphate','Potassium','Sulphate','Magnesium','Sulphate','Calcium','Sulphate','Ammonium','Nitrate','Urea','Calcium','Chloride','Calcium','Chloride');
  return NutrientName[ChemNum];
}

function GetNutrientPercent(ChemNum) {
  var NutrientPercent = new Array(38.7,61.3,28.7,69.8,44.9,55.1,9.9,39.0,23.3,55.8,22.5,77.5,100,53.0,47.0,35.9,31.8);
  return NutrientPercent[ChemNum];
}	

function GetGramsPerTsp(ChemNum) {
  var GramsPerTsp = new Array(6.0,6.0,6.6,6.6,5.1,5.1,5.1,5.1,4.1,4.1,5.0,5.0,4.5,3.5,3.5,3.2,3.2);
  return GramsPerTsp[ChemNum];
}	

function round(Value, Places) {
  return (Math.round(Value * Math.pow(10,Places)) / Math.pow(10,Places));
}

function convertPhosphorus() {
  var phosphorusValue = document.getElementById('phosphorus_input').value;
  var phosphateResult = document.getElementById('phosphate_result');
  
  if (phosphorusValue && !isNaN(phosphorusValue) && phosphorusValue >= 0) {
    var phosphateValue = (phosphorusValue * 3.066) / 1000;
    phosphateResult.value = round(phosphateValue, 4) + ' ppm';
  } else {
    phosphateResult.value = '';
  }
}

function GetSelectValue(TheSelect) {
  var the_index = TheSelect.selectedIndex;
  return TheSelect.options[the_index].value;
}

function calc_dosage() {
  var ChemNum = GetSelectValue(document.inputform.chemnum);
  var TankSize;
  if (document.inputform.TankSizeUnits[0].checked) {
    TankSize = document.inputform.tanksize.value;
  }
  if (document.inputform.TankSizeUnits[1].checked) {
    TankSize = document.inputform.tanksize.value / 0.2200;
  }
  if (document.inputform.TankSizeUnits[2].checked) {
    TankSize = document.inputform.tanksize.value / 0.2642;
  }
    
  var AmountOfChem;
  if (document.inputform.NutrientUnits[0].checked) {
    AmountOfChem = document.inputform.amount_chem.value;
  }
  if (document.inputform.NutrientUnits[1].checked) {
    AmountOfChem = document.inputform.amount_chem.value * GetGramsPerTsp(ChemNum);
  }
  if (document.inputform.NutrientUnits[2].checked) {
    AmountOfChem = document.inputform.amount_chem.value * (GetGramsPerTsp(ChemNum) * 3);
  }

  var PctChem = GetNutrientPercent(ChemNum);
  var AmountOfNutrient = AmountOfChem * (PctChem / 100);
  var PPM_In_One_Liter = AmountOfNutrient * 1000;
  var AmountSolnAdded = document.inputform.amount_soln.value;
  var TotalPPM_InTank = PPM_In_One_Liter * AmountSolnAdded / TankSize;
  var calculatedPPM = round(TotalPPM_InTank / document.inputform.amount_H2O.value,2);

  document.inputform.mixppm.value = calculatedPPM + ' ppm ' + GetNutrientName(ChemNum);

  // If Ammonium from Ammonium Nitrate (ChemNum == 10), also calculate and display Nitrate
  if (ChemNum == "10") {
    var nitratePPM = round(calculatedPPM * 3.6, 2);
    document.inputform.nitrate_ppm.value = nitratePPM + ' ppm Nitrate';
    document.getElementById('nitrate_result_line').style.display = 'block';
  } else {
    document.inputform.nitrate_ppm.value = '';
    document.getElementById('nitrate_result_line').style.display = 'none';
  }

  // create an instance of the Date object
  var now = new Date();
  // fix the bug in Navigator 2.0, Macintosh
  fixDate(now);
  /*
  cookie expires in one year (actually, 365 days)
  365 days in a year
  24 hours in a day
  60 minutes in an hour
  60 seconds in a minute
  1000 milliseconds in a second
  */
  now.setTime(now.getTime() + 365 * 24 * 60 * 60 * 1000);

  // set the new cookies
  setCookie("SaveTankSize", document.inputform.tanksize.value, now);
  setCookie("SaveAmountH2O", document.inputform.amount_H2O.value, now);
  setCookie("SaveAmountSoln", document.inputform.amount_soln.value, now);

  if (document.inputform.TankSizeUnits[0].checked) {
    setCookie("SaveTankUnits", 0, now);
  }  
  else if (document.inputform.TankSizeUnits[1].checked) {
    setCookie("SaveTankUnits", 1, now);
  }
  else {
    setCookie("SaveTankUnits", 2, now);
  } 
  
  if (document.inputform.NutrientUnits[0].checked) {
    setCookie("SaveNutUnits", 0, now);
  }  
  else if (document.inputform.NutrientUnits[1].checked) {
    setCookie("SaveNutUnits", 1, now);
  }
  else {
    setCookie("SaveNutUnits", 2, now);
  }
}

/*
   name - name of the cookie
   value - value of the cookie
   [expires] - expiration date of the cookie
     (defaults to end of current session)
   [path] - path for which the cookie is valid
     (defaults to path of calling document)
   [domain] - domain for which the cookie is valid
     (defaults to domain of calling document)
   [secure] - Boolean value indicating if the cookie transmission requires
     a secure transmission
   * an argument defaults when it is assigned null as a placeholder
   * a null placeholder is not required for trailing omitted arguments
*/
function setCookie(name, value, expires, path, domain, secure) {
  var curCookie = name + "=" + escape(value) +
      ((expires) ? "; expires=" + expires.toGMTString() : "") +
      ((path) ? "; path=" + path : "") +
      ((domain) ? "; domain=" + domain : "") +
      ((secure) ? "; secure" : "");
  document.cookie = curCookie;
}

/*
  name - name of the desired cookie
  return string containing value of specified cookie or null
  if cookie does not exist
*/
function getCookie(name) {
  var dc = document.cookie;
  var prefix = name + "=";
  var begin = dc.indexOf("; " + prefix);
  if (begin == -1) {
    begin = dc.indexOf(prefix);
    if (begin != 0) return null;
  } else
    begin += 2;
  var end = document.cookie.indexOf(";", begin);
  if (end == -1)
    end = dc.length;
  return unescape(dc.substring(begin + prefix.length, end));
}

/*
   name - name of the cookie
   [path] - path of the cookie (must be same as path used to create cookie)
   [domain] - domain of the cookie (must be same as domain used to
     create cookie)
   path and domain default if assigned null or omitted if no explicit
     argument proceeds
*/
function deleteCookie(name, path, domain) {
  if (getCookie(name)) {
    document.cookie = name + "=" +
    ((path) ? "; path=" + path : "") +
    ((domain) ? "; domain=" + domain : "") +
    "; expires=Thu, 01-Jan-70 00:00:01 GMT";
  }
}

// date - any instance of the Date object
// * hand all instances of the Date object to this function for "repairs"
function fixDate(date) {
  var base = new Date(0);
  var skew = base.getTime();
  if (skew > 0)
    date.setTime(date.getTime() - skew);
}