component  hint="I get the Contact data using Script syntax" output="false"
{
	import  BACFUG.com.*;
	
	remote any function getAllORM() 
	returnformat="JSON" 
	{
		qReturn = EntityLoad("contacts",{},"LastName Asc");
		
		return serializeJSON(qReturn);
	}

	remote any function getAllQuery() 
	returnformat="JSON" 	 
	{
		qObj = new Query();
		qObj.setSql( "SELECT * FROM Contacts");
		qObj.setName("myQuery");
		result = qObj.execute( );
		qResult = result.getResult(); 
 
		return serializeJSON(qResult);
	}

	remote any function getAllStruct() 
	returnformat="JSON" 
	{
	
		var qObj = new Query();
		qObj.setSql( "SELECT * FROM Contacts");
		qObj.setName("myQuery");
		var result = qObj.execute( );
		var qResult = result.getResult(); 
 
		var arrayContact = ArrayNew(1);
	 
 		for ( i = 1 ; i LTE qResult.RecordCount;i = (i + 1) )
		{ 
			var struct = StructNew();
			struct["FirstName"] = qResult.FirstName[i];
			struct["LastName"] = qResult.LastName[i];
			struct["Email"] = qResult.Email[i];
			temp = arrayAppend(arrayContact,struct);
		}
		
		return serializeJSON(arrayContact);		
	}
	
	
	remote any function addContact(String FirstName="",String LastName="") 
	{	
		newContact = new Contacts(arguments.FirstName,arguments.LastName);
		EntitySave(newContact);
	}

}