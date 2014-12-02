

function l(name) { return document.getElementById(name); }

l('debug').style.paddingRight = '150px';
l('debug').style.position = 'absolute';
l('debug').style.overflowX = 'scroll';

l('sidebar').style.display = 'none';

/*
javascript: (function () {
	var url = 'file:///C:/Users/Jrob/Desktop/NestedScript.js';
	var js=document.createElement('script');
	var id=url.split('/');id=id[id.length-1].split('.')[0];
	js.setAttribute('type','text/javascript');
	js.setAttribute('id','modscript_'+id);
	js.setAttribute('src',url);
	document.head.appendChild(js);
}());
*/
