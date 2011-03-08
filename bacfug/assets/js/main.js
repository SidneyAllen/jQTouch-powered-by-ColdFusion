/**
 * @author sidmaestre
 */

		
			function testReachable() {	
				return setTimeout(function() {
					navigator.network.isReachable("www.designovermatter.com",testHandler);
				}, 250); 
            }
			function testHandler(reachability) {
				netStatus = reachability.internetConnectionStatus;
				return netStatus;
			}
			
			function checkNetwork(){
				if(navigator.onLine == false){
					return false;
				} else {
					return true;
				}
			} 
			
			
			
					
			
            var jQT = new $.jQTouch({
				fullscreen: true,
				icon: 'assets/images/Icon.png',
				startupScreen: 'assets/images/startup.png',
    	        addGlossToIcon: true,
        	    statusBar: 'default',
            	useFastTouch: true,
           	 	slideSelector: 'ul li a',
				preloadImages: [
        		'themes/apple/img/back_button.png',
        		'assets/images/calendarDefault.png',
				'assets/images/calendarBlue.png',
        		'assets/images/twitterDefault.png',
				'assets/images/twitterBlue.png',
        		'assets/images/sponsorDefault.png',
				'assets/images/sponsorBlue.png',
        		'assets/images/speakerProfile.png',
        		'assets/images/speakerDefault.png',
				'assets/images/speakerBlue.png',
				'assets/images/mapDefault.png',
				'assets/images/mapBlue.png',
				'assets/images/moreDefault.png',
				'assets/images/moreBlue.png'
        		]					
			});
			
			
			
			
			
			
			
			var domain = "www.designovermatter.com"
			var map_init = false;
			var eventLocation = "";
	
	        $(document).ready(function() {
				
				// CHECK NETWORK STATUS BEFORE INITIALIZING APP
				setTimeout(function() {
					status = testReachable();
					//alert("Network Status " + status);
					if (status == 4) {
						initLocal();
					} else if (status > 0) {
						if (getUUId() == null) {
							init();
						} else {
							checkForUpdates();						
						}
					} else {
						navigator.notification.alert("Please try again later", "No Internet Connection", "OK!");
					}
				
				}, 250); 
				
				
	            $('#map').bind('pageAnimationStart', function(evt, info) {
	                // make sure we are not calling map redraw if leaving the screen...
	
	                if (info.direction == 'in') {
						if (checkNetwork()) {
							_buildmap(eventLocation);
						} else {
							navigator.notification.alert("Map can not be loaded at this time.", "No Internet Connection", "OK!");
						}
	                }
	            });
				
				setStartPage('session');
				
// --------------  GLOBAL VAR , GETTERS/SETTERS ------------------------//				
				var bottomBar = '<div class="bottomBar"><a class="sessionButton" href="#" >Sessions</a><a class="speakerButton" href="#">Speakers</a><a class="mapButton" href="#">Maps</a><a class="twitterButton" href="#">Twitter</a><a class="sponsorButton" href="#">Sponsors</a><a class="moreButton"  href="#">More</a></div>'
				
				var sessionArray = new Array(0);
				function getSessionArray() {
					return JSON.parse(localStorage.getItem('sessionArray'));
				}
				
				function setSessionArray(param) {
					localStorage.setItem('sessionArray', JSON.stringify(param));
				}
				
				var sponsorArray = new Array(0);
				function getSponsorArray() {
					return JSON.parse(localStorage.getItem('sponsorArray'));
				}
				
				function setSponsorArray(param) {
					localStorage.setItem('sponsorArray', JSON.stringify(param));
				}
				
				var eventArray = new Array(0);
				function getEventArray() {
					return JSON.parse(localStorage.getItem('eventArray'));
				}
				
				function setEventArray(param) {
					localStorage.setItem('eventArray', JSON.stringify(param));
				}
				
				var twitterProfileArray = new Array(0);
				function getTwitterProfileArray() {
					return JSON.parse(localStorage.getItem('twitterProfileArray'));
				}
				
				function setTwitterProfileArray(param) {
					localStorage.setItem('twitterProfileArray', JSON.stringify(param));
				}
				
				var ratingArray = new Array(0);
				function getRatingArray() {
					thisArray =  JSON.parse(localStorage.getItem('ratingArray'));
					if (thisArray == null) {
						thisArray = new Array(0);
					}
					return thisArray
				}
				function setRatingArray(param) {
					localStorage.setItem('ratingArray', JSON.stringify(param));
				}
				
				var commentArray = new Array(0);
				function getCommentArray() {
					thisArray =  JSON.parse(localStorage.getItem('commentArray'));
					if (thisArray == null) {
						thisArray = new Array(0);
					}
					return thisArray
				}
				function setCommentArray(param) {
					localStorage.setItem('commentArray', JSON.stringify(param));
				}
				
				
				
				function getSessionId() {
					return sessionStorage.getItem('sessionId');
				}
				
				function setSessionId(param) {
					sessionStorage.setItem('sessionId', param);
				}
				
				function getUUId() {
					return localStorage.getItem('UUId');
				}
				
				function setUUId(param) {
					localStorage.setItem('UUId', param);
				}
				
				function getLastUpdate() {
					return localStorage.getItem('lastUpdate');
				}
				
				function setLastUpdate(param) {
					localStorage.setItem('lastUpdate', param);
				}

				function getStartPage() {
					return sessionStorage.getItem('startPage');
				}
				
				function setStartPage(param) {
					sessionStorage.setItem('startPage', param);
				}



// --------------- INIT -----------------------------//				
				/*
				if (getUUId() == null) {
					init();
				} else {
					checkForUpdates();						
				}
				*/
	
				function checkForUpdates() {
					var dataString ='&EventId=1';
					$.ajax({
					    url: "http://" + domain + "/ncdevcon/com/init.cfc?wsdl&method=checkForUpdates" + dataString,
					    type: "POST",
					    success: checkForUpdatesResultHandler,
					    error: checkForUpdatesFailureHandler
					});
				}				

				function checkForUpdatesResultHandler(data) {
					var jdata = eval('(' + data + ')');
					var len = jdata.length ;
					var lastUpdate = getEventArray().lastUpdate;
					var msgDate = jdata[0].DateIn;
					var i = 0;
					
					for (i = 0; i < len; i++) {
						$("#startup .edgetoedge").append('<li class="messageItem">' + jdata[0].DateIn + '<br>' + jdata[0].Message +'</li>');
					}
					binder('startup');

					if(lastUpdate < msgDate) {
						setStartPage('startup');
						init();
						
					} else {
						initLocal();
					}
					
					console.log('success');
				}

				function checkForUpdatesFailureHandler() {
					console.log('failure');
					
					if (getSessionArray().length > 0) {
						alert('No connection, loading local data.');
						initLocal();
					} else {
						alert('No connection, try again later.');
					}
				}

					
				function init() {
					console.log('do init');
					
					var dataString ='&EventId=1';
					$.post("http://" + domain + "/ncdevcon/com/init.cfc?wsdl&method=initialize" + dataString,initEventHandler);
					$.post("http://" + domain + "/ncdevcon/com/init.cfc?wsdl&method=getSponsor" + dataString,initSponsorHandler);
					$.post("http://" + domain + "/ncdevcon/com/init.cfc?wsdl&method=getSession",initSessionHandler);
					$.post("http://" + domain + "/ncdevcon/com/init.cfc?wsdl&method=getMap" + dataString,initMapHandler);
					searchTwitter();
					//$("#startup ul.rounded").append('<li class="arrow"><a  style="color:#FF3300;" href="#session">Schedule Updates</a></li>')
				}
				
				function initLocal() {
					console.log('do init LOCAL');
					
					if(getUUId() == null) {
						navigator.notification.alert("Please try again later", "No Internet Connection", "OK!");
					} else {
						createSponsorHandler();
						createSessionHandler();
						createEventHandler();
						createTwitterHandler();
					}
					
				}

// ------------- TWITTER ------------------------------//
				function searchTwitter() {
					var url = "http://search.twitter.com/search.json?q=NCDevCon+ncdevcon+NCDevcon+NCdevcon&callback=?";
					var tempArray;
					$.getJSON(url,
				        function(data){
							//console.log(data.results);
							$.each(data.results, function(i, item) {
								
								tempArray = {
									image: item.profile_image_url,
									text: item.text,
									user: item.from_user
								}
								twitterProfileArray.push(tempArray);
								
							});
							
							setTwitterProfileArray(twitterProfileArray);
							createTwitterHandler();
				   		});
									
												
				}
				
				
				
				function createTwitterHandler() {
					var jdata = getTwitterProfileArray();
					var len = getTwitterProfileArray().length ;
					
					for (i = 0; i < len; i++) {
						if(checkNetwork()) {
							profilePic = jdata[i].image;
						} else {
							profilePic = 'assets/images/speakerProfile.png';
						}
					
						$("#twitter .edgetoedge").append('<li class="twitterItem"><img height="30" align="left" src="' + profilePic + '">' +  jdata[i].text + '</li>');						
					}
									
				}
				
				
// --------------- EVENT -----------------------------//				
				function initMapHandler(data){
					var jdata = eval('(' + data + ')');

					var location = jdata[0].Longitude + ',' + jdata[0].Latitude;
					eventLocation = location;
								
				}			
				
				
				
// --------------- EVENT -----------------------------//				
				function initEventHandler(data) {
					var jdata = eval('(' + data + ')');
					
					if ( $(jdata).length > 0) {
						var tempArray;
						setUUId(jdata.UUId);
						setLastUpdate(jdata.lastUpdate);
						
						// POPULATE STATUS ARRAY
						eventArray = {	logo : jdata.logo,
										description : jdata.description,
										website : jdata.website,
										email : jdata.email,
										twitter : jdata.twitter,
										lastUpdate : jdata.lastUpdate,
										UUId : jdata.UUId
									};
						
						setEventArray(eventArray);
						createEventHandler();
						
					} else {
						alert('no event data found');
					}
					
				}
				
				function createEventHandler() {
					var jdata = getEventArray();
					var logo = jdata.logo;
					var description = jdata.description;
					var website = jdata.website;
					var email = jdata.email;
					var twitter = jdata.twitter;
					
					
					document.getElementById("LogoImage").src = "data:image/jpeg;base64," + logo;

					// REMOVE AND ADD DESCRIPTION DIV
					$("#about .description").text('');
					
					if (description != null) {
						$("#about .description").append(description);
					}
					
					
					$("#about .description").append('<ul class="rounded"></ul>');
					if (website != null) {
						$("#about ul.rounded").append('<li class="arrow"><a target="_blank" href="' + website + '">website</a></li>');
					}
					if (email != null) {
						$("#about ul.rounded").append('<li class="arrow"><a target="_blank" href=mailto:"' + email + '">email</a></li>');
					}
					if (twitter != null) {
						$("#about ul.rounded").append('<li class="arrow"><a target="_blank" href="' + twitter + '">twitter</a></li>');
					}
					
			
					
				}
				
				
				
// --------------- SPONSOR -----------------------------//				
				function initSponsorHandler(data){
					var jdata = eval('(' + data + ')');
					var len = $(jdata).length ;
					var i = 0;
					var tempArray;
					
					for (i = 0; i < len; i++) {
						tempArray = {	Image : jdata[i].Image,
										Name : jdata[i].Name,
										Website : jdata[i].Website,
										Description : jdata[i].Description
									};
						// POPULATE STATUS ARRAY
						sponsorArray.push(tempArray);
					
					}
					setSponsorArray(sponsorArray);
					createSponsorHandler();
				}
				
				
				function createSponsorHandler(){
					var jdata = getSponsorArray();
					var len = getSponsorArray().length ;
					var i = 0;
					
					for (i = 0; i < len; i++) {
						$("#sponsor .edgetoedge").append('<li><a  href="" ><a href="' + jdata[i].Website + '" target="_blank"><span style="display:block;width:320px;" align="center"><img align="center" border="0" id="SponsorLogo' + i + '"></span></a></li>');
						document.getElementById("SponsorLogo" + i).src = "data:image/jpeg;base64," + jdata[i].Image;
					
					}
				}
				
				
// --------------- SESSION/SPEAKER -----------------------------//								
				function changeDayHandler(selectedDate) {
					var sessionArray = getSessionArray();
					var len = sessionArray.length;
					var currDayOfWeek = "" ;
					var currReverseDate = "" ;
					var currStartTime = "" ;
					var currId = 0;
					
					console.log('change day for session list');
					
					// REMOVE session list and re-add to bring list to top
					$('#sessionContent').remove();
					$('#session .vertical-scroll').append('<div id="sessionContent"><ul class="edgetoedge"></ul><div class="bottomSpacer">&nbsp;</div></div>');
					
					binder("session");

					// LOOP and CREATE SESSION data
					for (i = 0; i < len; i++) {
						var startTime =  sessionArray[i].startTime;
						var endTime =  sessionArray[i].endTime;
						var reverseDate =  sessionArray[i].reverseDate;
						var sessionName =  sessionArray[i].sessionName;
						var sessionId =  sessionArray[i].sessionId;
						var summary =  sessionArray[i].sessionSummary;
						
						var firstName =  sessionArray[i].firstName;
						var lastName =  sessionArray[i].lastName;
						var speakerId =  sessionArray[i].speakerId;
						var trackName = sessionArray[i].trackName;
						var dayOfWeekAbbrev = sessionArray[i].dayOfWeekAbbrev;
						
						if (speakerId == null) {
							firstName = "";
							lastName = "";
						}
						
						if ( selectedDate == reverseDate) {
							// CHECK if this SESSION has already been created
							if (currId != sessionId) {
								
								// ADD data to SESSION LIST
								if ( (currReverseDate != reverseDate) || (currStartTime != startTime) || (currEndTime != endTime)) {
									$('div#session  .edgetoedge').append('<h4>' + startTime + ' - ' + endTime + '</h4>');
									$('div#session  .edgetoedge').append( '<li class="arrow" id="' + sessionId +'"><a href="#session' + sessionId + '"  ><div class="sessionName">' + sessionName + '</div><div class="sessionSub"><div class="sessionSpeaker">' + firstName + ' ' + lastName + '</div><div class="sessionTrack">' + trackName + '</div></div></a></li>' );
									
									currReverseDate =  reverseDate;
									currStartTime = startTime;
									currEndTime = endTime;
							
								} else {
									$( 'div#session  .edgetoedge').append( '<li class="arrow" id="' + sessionId +'"><a href="#session' + sessionId + '"  ><div class="sessionName">' + sessionName + '</div><div class="sessionSub"><div class="sessionSpeaker">' + firstName + ' ' + lastName + '</div><div class="sessionTrack">' + trackName + '</div></div></a></li>' );
								}
								
												
								currId = sessionId;
							
							}
						}
					}
					
					$('#session  ul.edgetoedge li').click( function(e) {
						setSessionId(e.currentTarget.id);
						
					});
					
					$('.star').click( function(e) {
					
						if (checkNetwork()) {
							var rating = e.currentTarget.title;
							var tempArray;
							var ratingArray = getRatingArray();
							tempArray = { rating : rating,
									  sessionId : getSessionId() };
						
							var match = false;
							var i = 0;
							var ratingLen = ratingArray.length;
							for (i = 0; i < ratingLen; i++) {
								if (ratingArray[i].sessionId == getSessionId()) {
									match = true;
									break;
								}
							}
						
							if (match) {
								ratingArray.splice(i,1);
							}
							ratingArray.push(tempArray);
							setRatingArray(ratingArray);
							setStars(getSessionId(),rating);
							saveRating(rating);
						} else {
							navigator.notification.alert("Please try again later", "No Internet Connection", "OK!");
						}
					});
					
					
					$('.ratingComment').focus( function(e) {
						if (!checkNetwork()) {
							navigator.notification.alert("Your comments will not be saved.", "No Internet Connection", "OK!");
						}
						
						$('#session' + getSessionId() + ' .bottomBar').toggle();
						
					});
					
					
					$('.ratingComment').blur( function(e) {
						//alert('Save Comment');

						if (checkNetwork()) {
							
							$('#session' + getSessionId() + ' .bottomBar').toggle();

							comment = $(this).val();
						
							var tempArray;
							var commentArray = getCommentArray();
							tempArray = { comment : comment,
									  sessionId : getSessionId() };
						
							var match = false;
							var i = 0;
							var len = commentArray.length;
							for (i = 0; i < len; i++) {
								if (commentArray[i].sessionId == getSessionId()) {
									match = true;
									break;
								}
							}
						
							if (match) {
								commentArray.splice(i,1);
							}
							commentArray.push(tempArray);
							setCommentArray(commentArray);
							saveComment(comment);
						} else {
							navigator.notification.alert("Your comments will not be saved.", "No Internet Connection", "OK!");
							$(this).val("");
						}
						
					});
				
				}
				
				function setStars(sessionId,rating) {
					$('#session' + sessionId + ' .rating > div').each(function(index){
						$(this).removeClass('selected');
					});
					
					$('#session' + sessionId + ' .rating > div').each(function(index){
						if (index < rating) {
							$(this).toggleClass('selected');
						}
					});
				}
				
				function setComment(sessionId,comment) {
					$('#session' + sessionId + ' .ratingComment').val(comment);
				}
				
				function saveRating(data) {
					var dataString ='&UUId=' + getUUId() + '&rating=' + data + '&SessionId=' + getSessionId();
					$.post("http://" + domain + "/ncdevcon/com/ratings.cfc?wsdl&method=save" + dataString);
				}
				
				function saveComment(data) {
					var dataString ='&UUId=' + getUUId() + '&comment=' + data + '&SessionId=' + getSessionId();
					$.post("http://" + domain + "/ncdevcon/com/ratings.cfc?wsdl&method=saveComment" + dataString);
				}
				
				
				function createSessionHandler() {
					var sessionArray = getSessionArray();
					var len = sessionArray.length;
					var currDayOfWeek = "" ;
					var currReverseDate = "" ;
					var currStartTime = "" ;
					var currId = 0;
					var selectedDate = null;
					
					console.log('create sessions from array');
					
					$("#session ul.tabbar li").each(function(index){
						$(this).remove();
					});
					
					// LOOP and CREATE SESSION data
					for (i = 0; i < len; i++) {
						var startTime =  sessionArray[i].startTime;
						var endTime =  sessionArray[i].endTime;
						var reverseDate =  sessionArray[i].reverseDate;
						var sessionName =  sessionArray[i].sessionName;
						var sessionId =  sessionArray[i].sessionId;
						var summary =  sessionArray[i].sessionSummary;
						
						var firstName =  sessionArray[i].firstName;
						var lastName =  sessionArray[i].lastName;
						var speakerId =  sessionArray[i].speakerId;
						var trackName = sessionArray[i].trackName;
						var dayOfWeekAbbrev = sessionArray[i].dayOfWeekAbbrev;
						var dayOfWeek = sessionArray[i].dayOfWeek;
						
						if (speakerId == null) {
							firstName = "";
							lastName = "";
						}
						
						// CHECK if this SESSION has already been created
						if (currId != sessionId) {
							
							// CREATE each SESSION div
							$("#jqt").append('<div id="session' + sessionId +  '"><div class="toolbar"><a class="back">back</a><h1>' + dayOfWeekAbbrev + ' ' + startTime + ' - ' + endTime + '</h1></div></div>');
							$('#session' + sessionId).append('<div class="vertical-scroll"><div class="description"><span class="sessionTitle">' + sessionName  + '</span><br/><br/>  ' + summary + '<br><br></div><div class="bottomSpacer">&nbsp;</div></div>')	
							
							// APPEND TOOLBAR to BOTTOM
							$("#session" + sessionId).append(bottomBar);
							
							// SPEAKER exists append to SESSION
							if (speakerId != null) {
								$('#session' + sessionId + ' .description').append('<ul class="edgetoedge"><h4>Speakers</h4><li class="arrow"><a href="#speaker' + speakerId + '">' +  firstName + ' ' + lastName + '</a></li></ul><br>');							
							}
							
							$('#session' + sessionId + ' .description').append('<ul class="edgetoedge"><h4>Rate the Session</h4><li class="rating" style="height:40px"><div title="1" class="star">&nbsp;</div><div title="2" class="star">&nbsp;</div><div title="3" class="star">&nbsp;</div><div title="4" class="star">&nbsp;</div><div title="5" class="star">&nbsp;</div></li><li>Comments:<br><textarea class="ratingComment"></textarea></li></ul><div class="bottomSpacer">&nbsp;</div>');
							
							// SEARCH FOR MATCH in RATING ARRAY
							var rating = 0;
							var match = false;
							var x = 0;
							var ratingArray = getRatingArray();
							var ratingLen = ratingArray.length;
							for (x = 0; x < ratingLen; x++) {
								if (ratingArray[x].sessionId == sessionId ) {
									match = true;
									rating = ratingArray[x].rating;
									console.log('match it here');
									break; 
								}
								
							}
							
							// if match set the STAR RATING
							if (match) {
								setStars(sessionId,rating);
							}
							
							
							// SEARCH FOR MATCH in RATING ARRAY
							var comment = "";
							var match = false;
							var y = 0;
							var commentArray = getCommentArray();
							var commentLen = commentArray.length;
							for (x = 0; x < commentLen; x++) {
								if (commentArray[x].sessionId == sessionId ) {
									match = true;
									comment = commentArray[x].comment;
									console.log('match it here');
									break; 
								}
								
							}
							
							// if match set the STAR RATING
							if (match) {
								setComment(sessionId,comment);
							}
							
							
							
							
													
							currId = sessionId;
							binder("session" + sessionId);
						} else {
							// SESSION exists, append additional speakers.
							$('#session' + sessionId + ' .edgetoedge').append('<li class="arrow"><a href="#speaker' + speakerId + '">' +  firstName + ' ' + lastName + '</a></li>');														
						}
					
					
						if (currDayOfWeek == "") {
							isSelected = true;
						}
						
						
						
						// ADD the DAYS of the WEEK							
						if (currDayOfWeek != dayOfWeek) {
							if (selectedDate == null || reverseDate > selectedDate) {
								
								$('#session  .tabbar').append('<li id="tab' + reverseDate + '" title="' + reverseDate + '">' + dayOfWeek + '</li>');
								
								currDayOfWeek = dayOfWeek;
								
								$('#tab' + reverseDate).click(function(e){
									changeDayHandler(e.currentTarget.title);
									$("#session ul.tabbar li").each(function(index){
										$('#tab' + $(this).attr('title')).toggleClass('selected');
										
									});
								});
							}
						}
						
						if (isSelected) {
							// Added SELECTED Class to item	
							$('#tab'+ reverseDate).toggleClass('selected');
							selectedDate = reverseDate;
							
							isSelected =false;
						}
					}
					
					changeDayHandler(selectedDate);
					
					// GO TO Session Div
					jQT.goTo($('#' + getStartPage()), 'fade');
					
					var speakerArray = new Array;
					
					// LOOP and CREATE SPEAKER data
					for ( j=0; j < len; j++ )  {
						var speakerId =  sessionArray[j].speakerId;
						var fullName = sessionArray[j].firstName + '  ' +  sessionArray[j].lastName;
						var speakerBio = sessionArray[j].speakerBio;
						var speakerPhoto = sessionArray[j].speakerPhoto;
						var sessionName =  sessionArray[j].sessionName;
						var sessionId =  sessionArray[j].sessionId;
						var speakerWebsite = sessionArray[j].speakerWebsite;
						var speakerEmail = sessionArray[j].speakerEmail;
						var speakerTwitter = sessionArray[j].speakerTwitter;
					
						// CHECK if this SPEAKER has already been created
						if (jQuery.inArray(speakerId,speakerArray) == -1) {	
							
							// ADD SPEAKER to An Array
							speakerArray.push(speakerId);
						
						
							if (speakerId != null) {
								// ADD data to SPEAKER LIST
								$("#speaker ul.edgetoedge").append('<li class="arrow"><a  href="#speaker' + speakerId + '">' + fullName + '</a></li>');
							}
							
							// CREATE each SPEAKER div
							$("#jqt").append('<div id="speaker' + speakerId + '"><div class="toolbar"><a class="back">back</a><h1>' + fullName + '</h1></div><div class="vertical-scroll"><div class="description"><span class="profile" style="height:100px;display:block;"></span></div></div>');
							$("#speaker" + speakerId).append(bottomBar);
							
							
							if (speakerPhoto != undefined) {
								$("#speaker" + speakerId + " .profile").append('<img src="' + speakerPhoto + '"  align="left"  style="padding-right:10px; padding-bottom:10px;" />');
							}
							
							if (speakerPhoto == undefined) {
								$("#speaker" + speakerId + " .profile").append('<img src="assets/images/speakerProfile.png"  align="left"  style="padding-right:10px; padding-bottom:10px;" />');
							}
							
							if (speakerBio != undefined) {
								$("#speaker" + speakerId + " .profile").append(speakerBio);
							}
							
							if (speakerBio == undefined) {
								$("#speaker" + speakerId + " .profile").append("Speaker information coming soon.");
							}


							$('#speaker' + speakerId + ' .description').append('<ul class="edgetoedge"></ul>');
														

							if ( (speakerWebsite != undefined && speakerWebsite.length > 0) || (speakerTwitter != undefined && speakerTwitter.length > 0) || (speakerTwitter != undefined && speakerTwitter.length > 0) ) {
								
								$('#speaker' + speakerId + ' .edgetoedge').append('<h4>Contact</h4>');


								if (speakerWebsite != undefined && speakerWebsite.length > 0) {
									$('#speaker' + speakerId + ' .edgetoedge').append('<li class="arrow"><a href="' + speakerWebsite + '">Website</a></li>');									
								}

								if (speakerEmail != undefined && speakerEmail.length > 0) {
									$('#speaker' + speakerId + ' .edgetoedge').append('<li class="arrow"><a href="' + speakerEmail + '">Email</a></li>');									
								}

								if (speakerTwitter != undefined && speakerTwitter.length > 0) {
									$('#speaker' + speakerId + ' .edgetoedge').append('<li class="arrow"><a href="' + speakerTwitter + '">Twitter</a></li>');									
								}
							}
				
						
							$('#speaker' + speakerId + ' .edgetoedge').append('<h4>Sessions</h4><li class="arrow"><a id="' + sessionId + '" href="#session' + sessionId + '">' + sessionName + '</a></li>');
														
							binder("speaker" + speakerId);
							
							$('#speaker' + speakerId + '  ul.edgetoedge li a').click( function(e) {								
								var sessionId =  e.currentTarget.id;
								if (sessionId > 0) {
									setSessionId(e.currentTarget.id);
								}
						
							});

							
							
						} else {
							// SPEAKER exists, append additional SESSIONS.
							$('#speaker' + speakerId + ' .edgetoedge').append('<li class="arrow"><a href="#session' + sessionId + '">' +  sessionName + '</a></li>');														
							
						}
						
					}	
					
					
					
					$('.sessionButton').click( function(e) {
						jQT.goTo($('#session'), 'slideup');
					});
					
					$('.speakerButton').click( function(e) {
						jQT.goTo($('#speaker'), 'slideup');
					});
					
					$('.mapButton').click( function(e) {
						jQT.goTo($('#map'), 'slideup');
					});
					
					$('.twitterButton').click( function(e) {
						jQT.goTo($('#twitter'), 'slideup');
					});
					
					$('.sponsorButton').click(  function(e) {
						jQT.goTo($('#sponsor'), 'slideup');
					});
					
					$('.moreButton').click( function(e) {
						jQT.goTo($('#more'), 'slideup');
					});
					
				
				}

				

				
				// ADD data to SESSION LIST and create each SESSION div
				function initSessionHandler(data){
				
					var jdata = eval('(' + data + ')');
					var len = $(jdata.DATA).length;
					var i = 0;
					var currDayOfWeek = "" ;
					var currReverseDate = "" ;
					var currStartTime = "" ;
					var currId = 0;
					var tempArray;
					        	
            		for (i = 0; i < len; i++) {
						var startTime =  jdata.DATA[i][0];
						var endTime =  jdata.DATA[i][1];
						var reverseDate =  jdata.DATA[i][2];
						var name =  jdata.DATA[i][4];
						var id =  jdata.DATA[i][5];
						var summary =  jdata.DATA[i][6];
						
						var firstName =  jdata.DATA[i][7];
						var lastName =  jdata.DATA[i][8];
						var speakerId =  jdata.DATA[i][9];
						var trackName = jdata.DATA[i][12];
						var dayOfWeekAbbrev = jdata.DATA[i][13];
						var dayOfWeek = jdata.DATA[i][17];
						var isSelected = false;
						

						tempArray = {	startTime : jdata.DATA[i][0],
										endTime : jdata.DATA[i][1],
										reverseDate : jdata.DATA[i][2],
										sessionName : jdata.DATA[i][4],
										sessionId : jdata.DATA[i][5],
										sessionSummary : jdata.DATA[i][6],
										firstName : jdata.DATA[i][7],
										lastName : jdata.DATA[i][8],
						 				speakerId : jdata.DATA[i][9],
										speakerBio : jdata.DATA[i][10],
										speakerPhoto : jdata.DATA[i][11],
						 				trackName : jdata.DATA[i][12],
						 				dayOfWeekAbbrev : jdata.DATA[i][13],
										speakerWebsite : jdata.DATA[i][14],
										speakerEmail : jdata.DATA[i][15],
										speakerTwitter : jdata.DATA[i][16],
						 				dayOfWeek : jdata.DATA[i][17]
									};
						// POPULATE STATUS ARRAY
						sessionArray.push(tempArray);
					
					}
					
					setSessionArray(sessionArray);
					createSessionHandler();
						
					return false;
				
				}
				
				
				$('#session').bind('pageAnimationStart', function(evt, info) {
	
	                if (info.direction == 'in') {
	                    $('.sessionButton').css("color","#B5C8CE");
						$('.sessionButton').css("background","url(assets/images/calendarBlue.png) top no-repeat");
	                }
					
					if (info.direction == 'out') {
	                    $('.sessionButton').css("color","#333333");
						$('.sessionButton').css("background","url(assets/images/calendarDefault.png) top no-repeat");

	                }
	            });
				
				$('#speaker').bind('pageAnimationStart', function(evt, info) {
	
	                if (info.direction == 'in') {
	                    $('.speakerButton').css("color","#B5C8CE");
						$('.speakerButton').css("background","url(assets/images/speakerBlue.png) top no-repeat");
	                }
	
					
					if (info.direction == 'out') {
	                    $('.speakerButton').css("color","#333333");
						$('.speakerButton').css("background","url(assets/images/speakerDefault.png) top no-repeat");

	                }
	            });
				
				
				$('#sponsor').bind('pageAnimationStart', function(evt, info) {
	
	                if (info.direction == 'in') {
	                    $('.sponsorButton').css("color","#B5C8CE");
						$('.sponsorButton').css("background","url(assets/images/sponsorBlue.png) top no-repeat");
	                }
					
					if (info.direction == 'out') {
	                    $('.sponsorButton').css("color","#333333");
						$('.sponsorButton').css("background","url(assets/images/sponsorDefault.png) top no-repeat");

	                }
	            });

				$('#map').bind('pageAnimationStart', function(evt, info) {
	
	                if (info.direction == 'in') {
	                    $('.mapButton').css("color","#B5C8CE");
						$('.mapButton').css("background","url(assets/images/mapBlue.png) top no-repeat");
	                }
					
					if (info.direction == 'out') {
	                    $('.mapButton').css("color","#333333");
						$('.mapButton').css("background","url(assets/images/mapDefault.png) top no-repeat");

	                }
	            });

				$('#twitter').bind('pageAnimationStart', function(evt, info) {
	
	                if (info.direction == 'in') {
	                    $('.twitterButton').css("color","#B5C8CE");
						$('.twitterButton').css("background","url(assets/images/twitterBlue.png) top no-repeat");
	                }
					
					if (info.direction == 'out') {
	                    $('.twitterButton').css("color","#333333");
						$('.twitterButton').css("background","url(assets/images/twitterDefault.png) top no-repeat");

	                }
	            });



				$('#more').bind('pageAnimationStart', function(evt, info) {
	
	                if (info.direction == 'in') {
	                    $('.moreButton').css("color","#B5C8CE");
						$('.moreButton').css("background","url(assets/images/moreBlue.png) top no-repeat");
	                }
					
					if (info.direction == 'out') {
	                    $('.moreButton').css("color","#333333");
						$('.moreButton').css("background","url(assets/images/moreDefault.png) top no-repeat");

	                }
	            });

		
			
				$("#startup").append(bottomBar);
				$("#speaker").append(bottomBar);
				$("#map").append(bottomBar);
				$("#twitter").append(bottomBar);
				$("#sponsor").append(bottomBar);
				$("#more").append(bottomBar);
				$("#session").append(bottomBar);
				$("#about").append(bottomBar);
				$("#credit").append(bottomBar);
				
				// initial binding
				$('.sessionButton').click( function(e) {
					jQT.goTo($('#session'), 'slideup');
				});
				
				$('.speakerButton').click( function(e) {
					jQT.goTo($('#speaker'), 'slideup');
				});
				
				$('.mapButton').click( function(e) {
					jQT.goTo($('#map'), 'slideup');
				});
				
				$('.twitterButton').click( function(e) {
					jQT.goTo($('#twitter'), 'slideup');
				});
				
				$('.sponsorButton').click(  function(e) {
					jQT.goTo($('#sponsor'), 'slideup');
				});
				
				$('.moreButton').click( function(e) {
					jQT.goTo($('#more'), 'slideup');
				});

				$('#ResetApp').click( function(e) {
						init();
				});
				
				
				
				
				function scrollTop() {
					
					$('.vertical-scroll').each(function(index) {
    					//alert(index + ': ' + $(this).text());
						
						$(this).scrollTop = 0	
					
					});
					
				}
				
				function binder(param)
                {
                	vertical = $('#' + param + ' .vertical-scroll div');
                    vertical.scrollVertically({acceleration: Number(vertical.attr("scrollspeed") || 0.009)});
                } 
				
	        });	
				

			function _buildmap(data) {
				if (map_init == true) return;
	            map_init = true;
				
	            var latlng = new google.maps.LatLng(35.77435,-78.65967);
	
	            //var eventIcon = 'http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=cafe|996600';
	            var starticon = 'http://www.google.com/mapfiles/dd-start.png';
	 			var eventIcon = 'http://www.google.com/mapfiles/dd-start.png';
	
	            var myOptions = {
				    zoom: 13,
				    center: latlng,
				    mapTypeId: google.maps.MapTypeId.ROADMAP,
			    	mapTypeControl: true,
			    	mapTypeControlOptions: { style: google.maps.MapTypeControlStyle.DROPDOWN_MENU },
			    	navigationControl: true,
			    	navigationControlOptions: { style: google.maps.NavigationControlStyle.SMALL }
				};
	
	            var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	            google.maps.event.trigger(map, 'resize');
	
	             
	             var marker = new google.maps.Marker({
				    position: new google.maps.LatLng(35.77088, -78.67761),
				    map: map,
				    title: "You",
			    	icon: starticon });
				
	            var marker = new google.maps.Marker({
			    	position: new google.maps.LatLng(35.78068,-78.64385),
			    	map: map,
			    	title: "Event Location",
			    	icon: eventIcon
				});
	        }
			
			
 