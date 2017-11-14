const FACE_PLUS_DETECT_URL = "https://api-us.faceplusplus.com/facepp/v3/detect";
const FACE_PLUS_COMPARE_URL = "https://api-us.faceplusplus.com/facepp/v3/compare";

//const IMAGE_URL = "http://www.pianohelp.net/pictures/PSY%20-%20Gangnam%20Style.jpeg"; //PSY
//const IMAGE_URL = "https://vignette.wikia.nocookie.net/justdance/images/9/97/Beyonce.jpg"; //Beyonce
//const IMAGE_URL = "https://pbs.twimg.com/profile_images/782474226020200448/zDo-gAo0_400x400.jpg"; //Elon Musk
//const IMAGE_URL = "http://cdn.cnn.com/cnnnext/dam/assets/161109151138-04-hillary-clinton-concession-speech-1109-full-169.jpg"; //Clinton
//const IMAGE_URL = "http://1.bp.blogspot.com/-hMUpDcPMJUI/Vm75r4udnGI/AAAAAAAARLc/cUm2sWkeODk/s1600/Jennifer%2BLawrence%2Bhunger%2Bgames%2Bprequels%2Btoo%2Bsoon.jpg";
//const IMAGE_URL = "https://upload.wikimedia.org/wikipedia/commons/7/71/Tom_Cruise_avp_2014_4.jpg"; //Tom Cruise
//const IMAGE_URL = "http://i.dailymail.co.uk/i/pix/2015/10/21/01/016E0FB30000044D-0-image-a-40_1445387689827.jpg" //Yao Ming

var DETECT_IMAGE_URL = "";
var COMPARE_IMAGE_URL = "";

function postDetectData(callback) {
	//Query parameters for face detection API call
	const query = {
		api_key: "ed6us9-OR9eJ-TEAfUuI1btwiAeIEqrm",
		api_secret: "JEnUSKtyvfiXX8xQnxfqD8NJKIMllhbp",
		image_url: DETECT_IMAGE_URL,
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

function postCompareData(callback) {
	const query = {
		api_key: "ed6us9-OR9eJ-TEAfUuI1btwiAeIEqrm",
		api_secret: "JEnUSKtyvfiXX8xQnxfqD8NJKIMllhbp",
		image_url1: DETECT_IMAGE_URL,
		image_url2: COMPARE_IMAGE_URL
	}
	$.post(FACE_PLUS_COMPARE_URL, query, callback, "json");

}

function renderDetectResult(DETECT_IMAGE_URL, result) {
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
				<img id="face-img" src="${DETECT_IMAGE_URL}">
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
	`;
}

function renderCompareResult(COMPARE_IMAGE_URL, result) {
	const getConfidence = result.confidence;

	return `
		<div class="handle-img">
			<div class="img-box">
				<span class="helper"></span>
				<img id="compare-img" src="${COMPARE_IMAGE_URL}">
				<div class="js-drawFaceBorder drawFaceBorder">
					<div class="js-landmarkBox landmarkBox"></div>
				</div>
			</div>
		</div>

		<div class="face-circle">
			<h3 class="face-title">${getConfidence}%</h3>
			<span class="face-text">Alike</span>
		</div>
	`;

}

function renderCompareUpload() {
	return `
		<h2>Upload another pic for comparison!</h2>	
		<form action="#" class="compare-img-url">
			<label for="compare-url"></label>	
			<input type="text" id="compare-url" class="compare-url">
			<button type="submit">Upload</button>
		</form>
	`;
}

				





function renderRestartButton() {
	return `
		<h2>Restart</h2>	
		<label for="restart"></label>	
		<button class="js-restart-button" id="restart" type="button">Restart</button>	
	`;
}

function displayLandmarkBox(data) {
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
	//$('.face-detect-results').html(result);

}


//Displaying face detection data from Face++ API
//Dimension variables calculated based on original image are updated to reflect displayed (resized) image dimension 
function displayFaceDetectData(data) {
	//console.log(data.faces[0].attributes.headpose.roll_angle);
	//const results = data.items.map((item, index) => renderDetectResult(item));
	
	//Calling function for html generation
	$('.face-detect').html('');

	const result = renderDetectResult(DETECT_IMAGE_URL, data);
	$('.face-detect-results').html(result);

	const compareButton = renderCompareUpload();
	$('.face-compare').html(compareButton);

	const restartButton = renderRestartButton();
	$('.face-restart').html(restartButton);


	//Listen to image loading complete event to trigger the drawing of landmark box
	$('#face-img').on('load', event => {
//	$('#face-img').load(event => {
		console.log('here!');
		displayLandmarkBox(data);
	});
	
}

function displayFaceCompareData(data) {
	const result = renderCompareResult(COMPARE_IMAGE_URL, data);
	$('.face-compare-results').html(result);
}



////////////////////////////////////////////////////////////////////////////////////////////////////////
function renderInit() {
	return `
		<header class="col-12 text-center mt-20">
			<h1>Are you pretty, ugly, or pretty ugly :)</h1>
			<h2>Upload a selfie for analysis!</h2>
		</header>	
		<form class="col-12 detect-img-url text-center" action="#">
			<label class="col-12" for="detect-url"></label>	
			<input class="col-6 detect-url" type="text" id="detect-url">
			<button class="btn btn-primary" type="submit">Upload</button>
		</form>	
	`;

	

}

function displayInit() {
	const init = renderInit();
	$('.face-detect').html(init);
	$('.face-detect-results').html('');
	$('.face-compare-results').html('');
	$('.face-compare').html('');
	$('.face-restart').html('');
	uploadDetect();
}

//Upload event triggered when user click upload button to input an image URL

/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
////////////////////change from submit to click???//////////////////////////////
function uploadDetect() {
	$('.detect-img-url').submit(event => {
		console.log(`Uploading Detect!`);
		event.preventDefault();
		DETECT_IMAGE_URL = $('.detect-url').val();
		console.log(DETECT_IMAGE_URL);
		$('.detect-url').val("");
		postDetectData(displayFaceDetectData);
		uploadCompare();	
	});
}

function uploadCompare() {
	$('.face-compare').on('click', event => {
	//$('.compare-img-url').submit(event => {
		console.log(`Uploading Compare!`);
		event.preventDefault();
		COMPARE_IMAGE_URL = $('.compare-url').val();
		console.log(COMPARE_IMAGE_URL);
		$('.compare-url').val("");
		postCompareData(displayFaceCompareData);
	});
}

function restartDetect() {
	$('.face-restart').on('click', '.js-restart-button', event => {
		DETECT_IMAGE_URL = "";
		COMPARE_IMAGE_URL = "";
		displayInit();
		console.log(`Restart Clicked!`);

	});
}

function initApp() {
	displayInit();
	restartDetect();
}

$(initApp);