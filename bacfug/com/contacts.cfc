component  
output="true"  
persistent="true"  
table="Contacts"  
accessors="true" 
hint="I handle the Contacts methods and properties"
{
	property name="ContactId" fieldtype="id" generator="identity" type="numeric" elementtype="integer";
	property name="FirstName" type="string";
	property name="LastName" type="string";
	property name="Email" type="string" ;	

	public contacts function init(String FirstName="" ,String LastName="" ) 
	output="false"
	hint="I initialize this componenet and return a copy of this component"
	{
			this.setFirstName(arguments.FirstName);
			this.setLastName(arguments.LastName);
			return this;
	}
}
