const FACE_PLUS_DETECT_URL = "https://api-us.faceplusplus.com/facepp/v3/detect";
const FACE_PLUS_COMPARE_URL = "https://api-us.faceplusplus.com/facepp/v3/compare";

//const IMAGE_URL = "http://www.pianohelp.net/pictures/PSY%20-%20Gangnam%20Style.jpeg"; //PSY
//const IMAGE_URL = "https://vignette.wikia.nocookie.net/justdance/images/9/97/Beyonce.jpg/revision/latest?cb=20170517131254"; //Beyonce
//const IMAGE_URL = "https://pbs.twimg.com/profile_images/782474226020200448/zDo-gAo0_400x400.jpg"; //Elon Musk
//const IMAGE_URL = "http://cdn.cnn.com/cnnnext/dam/assets/161109151138-04-hillary-clinton-concession-speech-1109-full-169.jpg"; //Clinton
//const IMAGE_URL = "http://1.bp.blogspot.com/-hMUpDcPMJUI/Vm75r4udnGI/AAAAAAAARLc/cUm2sWkeODk/s1600/Jennifer%2BLawrence%2Bhunger%2Bgames%2Bprequels%2Btoo%2Bsoon.jpg";
//const IMAGE_URL = "https://upload.wikimedia.org/wikipedia/commons/7/71/Tom_Cruise_avp_2014_4.jpg"; //Tom Cruise
//const IMAGE_URL = "http://i.dailymail.co.uk/i/pix/2015/10/21/01/016E0FB30000044D-0-image-a-40_1445387689827.jpg" //Yao Ming

var IMAGE_URL = "";

function postDetectData(IMAGE_URL, callback) {
	//Query parameters for face detection API call
	const query = {
		api_key: "ed6us9-OR9eJ-TEAfUuI1btwiAeIEqrm",
		api_secret: "JEnUSKtyvfiXX8xQnxfqD8NJKIMllhbp",
		image_url: IMAGE_URL,
		return_landmark: 2,
		return_attributes: "gender,age,smiling,facequality,eyestatus,emotion,skinstatus,beauty,ethnicity,headpose"
/*
gender
age
smiling
headpose
facequality
blur
eyestatus
emotion
ethnicity
beauty
mouthstatus
eyegaze
skinstatus
*/
	}
	//$.getJSON(FACE_PLUS_URL, query, callback);
	$.post(FACE_PLUS_DETECT_URL, query, callback, "json");
		//console.log(IMAGE_URL);
	
}

function renderResult(result) {
	//const genderScore = gender.toLowerCase()+"_score";
	//const beauty = result.faces[0].attributes.beauty.genderScore;

			
	//Sort emotion object in an array to find out the greatest confidence
	const emotions = result.faces[0].attributes.emotion;
	var sortEmotions = [];
	
	for (var emotion in emotions) {
		sortEmotions.push([emotion,emotions[emotion]]);
	}
	//Sort emotion confidence level from high to low
	sortEmotions.sort((a,b) => b[1]-a[1]);

	//Sort skin object in an array to find out the greatest confidence
	const skins = result.faces[0].attributes.skinstatus;
	var sortSkins = [];
	
	for (var skin in skins) {
		sortSkins.push([skin,skins[skin]]);
	}
	//Sort skin confidence level from high to low
	sortSkins.sort((a,b) => b[1]-a[1]);
	

	const getGender = result.faces[0].attributes.gender.value;
	const getAge = result.faces[0].attributes.age.value;
	const getEthnicity = result.faces[0].attributes.ethnicity.value;
	const getEmotion = sortEmotions[0][0];
	const getSkin = sortSkins[0][0];
		


	return `
		<div class="handle-img">
			<div class="img-box">
				<span class="helper"></span>
				<img id="face-img" src="${IMAGE_URL}">
				<div class="js-drawFaceBorder drawFaceBorder">
					<div class="js-landmarkBox landmarkBox"></div>
				</div>
			</div>
		</div>
		
		<div class="face-details">
			<div class="face-circle">
				<h3 class="face-title">${getGender}</h3>
				<span class="face-text">Gender</span>
			</div>
			<div class="face-circle">
				<h3 class="face-title">${getAge}</h3>
				<span class="face-text">Age</span>
			</div>
			<div class="face-circle">
				<h3 class="face-title">${getEthnicity}</h3>
				<span class="face-text">Race</span>
			</div>
			<div class="face-circle">
				<h3 class="face-title">${getEmotion}</h3>
				<span class="face-text">Emotion</span>
			</div>
			<div class="face-circle">
				<h3 class="face-title">${getSkin}</h3>
				<span class="face-text">Skin</span>
			</div>
		</div>	
		<div class="description">
				<span><h4></h4></span>
				<span></span>
		</div>
	`;

				

}

//Displaying face detection data from Face++ API
//Dimension variables calculated based on original image are updated to reflect displayed (resized) image dimension 
function displayFaceDetectData(data) {
	//console.log(data.faces[0].attributes.headpose.roll_angle);
	//const results = data.items.map((item, index) => renderResult(item));
	
	//Calling function for html generation
	const result = renderResult(data);
	$('.face-analysis-results').html(result);

	//Defining dimension and positioning of original and displayed (resized) image
	const naturalWidth = document.getElementById('face-img').naturalWidth;
	const naturalHeight = document.getElementById('face-img').naturalHeight;
	const width = document.getElementById('face-img').clientWidth;
	const height = document.getElementById('face-img').clientHeight;
	const marginleft = -(width/2);
	const margintop= -(height/2);
	var resize_ratio = 1;
	
	//Calculate resize ratio for correct positioning of landmarkBox 
	if (naturalWidth>width) {
		resize_ratio = naturalWidth/width;
	} 
		
	//Based on displayed (resized) image dimension	
	//Set the dimension of the landmarkBox (box(es) around the face(s))
	const roll_angle = data.faces[0].attributes.headpose.roll_angle/resize_ratio;
	const face_rectangle_width = data.faces[0].face_rectangle.width/resize_ratio;
	const face_rectangle_height = data.faces[0].face_rectangle.height/resize_ratio;
	const face_rectangle_left = data.faces[0].face_rectangle.left/resize_ratio;
	const face_rectangle_top = data.faces[0].face_rectangle.top/resize_ratio;


	//Update the drawFaceBorder(current image dimention and position)
	//Update the landmarkBox(box(es) around the face(s))
	/*
	$('#face-img').on('load', event => {
		$('#face-img').after(`
			<div class="drawFaceBorder" style="width:${width}px; height:${height}px; top:50%; left:50%; margin-left:${marginleft}px; margin-top:${margintop}px;">	
				<div class="landmarkBox" style="transform: rotateZ(${roll_angle}deg); width:${face_rectangle_width}px; height:${face_rectangle_height}px; left:${face_rectangle_left}px; top:${face_rectangle_top}px;"></div>
			</div>
		`);
	});
*/
	$('.js-drawFaceBorder').attr('style', `width:${width}px; height:${height}px; top:50%; left:50%; margin-left:${marginleft}px; margin-top:${margintop}px;`);
	$('.js-landmarkBox').attr('style', `transform: rotateZ(${roll_angle}deg); width:${face_rectangle_width}px; height:${face_rectangle_height}px; left:${face_rectangle_left}px; top:${face_rectangle_top}px;`);
	
	//console.log(roll_angle);
	//$('.face-analysis-results').html(result);

}
/*
function displayFaceCompareData(data) {
	const result = renderResult(data);
	$('.js-search-results').html(result);
}
*/


//Upload event triggered when user click upload button to input an image URL
function watchUpload() {
	//console.log(`watchSubmit running~`);

	$('.image-url').submit(event => {
		console.log(`Uploading!`);
		event.preventDefault();
		const uploadTarget = $(this).find('.url');
		IMAGE_URL = uploadTarget.val();
		uploadTarget.val("");
		postDetectData(IMAGE_URL, displayFaceDetectData);
		//Calling the function second time to fully load resized image dimension 
		//landmarkBox needs the updated resized image dimension for correct dimension and positioning 
		postDetectData(IMAGE_URL, displayFaceDetectData);
	});

//  postCompareData(displayFaceCompareData);

}

$(watchUpload);