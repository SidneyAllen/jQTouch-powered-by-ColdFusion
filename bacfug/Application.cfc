component hint="I define the application settings and event handlers" 
{
	this.name = "bacfugapp2";
	this.ormEnabled = true;
	this.datasource = "jqtouch";
	this.ormSettings.logSQL = true;
	this.ormSettings.dbCreate = "dropcreate";
	this.ormSettings.cfclocation = "com";

	public void function onRequestStart(){
		showdebugoutput= false;
		
		if (isDefined('url.refresh')) {
			ApplicationStop();
	      
		}
		
	}
}


