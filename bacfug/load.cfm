
<cfscript>
import  bacfug.com.*;

contact = new contacts('Sid','Maestre');
contact.setEmail('sid.maestre@designovermatter.com');
EntitySave(contact);

contact = new contacts('Pat','Santora');
contact.setEmail('patweb99@gmail.com');
EntitySave(contact);

contact = new contacts('Dan','Zeitman');
contact.setEmail('dvpweb@gmail.com');
EntitySave(contact);


</cfscript>

Data Loaded