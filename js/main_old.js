/* * * * * * * * * * * * * *
*           MAIN           *
* * * * * * * * * * * * * */

// init global variables & switches

let imageViewer

let dataSetNames = ['rob_1']
let selectedDataSet = 'rob_1'
let imageNamesInSelectedDataSet = []
let selectedImageName = ''



// on button click switch view
function switchView() {
    //document.getElementById('switchView').innerHTML === 'switch to individual experiment view' ? document.getElementById('switchView').innerHTML = 'switch to overview' : document.getElementById('switchView').innerHTML = 'switch to individual experiment view';

    // if currently we are at the overview, then the button should show 'switch to individual view'
    if(document.getElementById('switchView').innerHTML === 'switch to individual experiment view'){

        // change button
        document.getElementById('switchView').innerHTML = 'switch to overview'

        // hide overview & show detailed view
        document.getElementById('overviewDiv').classList.add("d-none");
        document.getElementById('detailsDiv').classList.remove("d-none");

    } else {
        // change button
        document.getElementById('switchView').innerHTML = 'switch to individual experiment view'

        // hide overview & show detailed view
        document.getElementById('overviewDiv').classList.remove("d-none");
        document.getElementById('detailsDiv').classList.add("d-none");

    }

}



// load data using promises
let promises = [
    d3.json("data/full_info.json")
];

Promise.all(promises)
    .then(function (data) {
        initMainPage(data)
    })
    .catch(function (err) {
        console.log(err)
    });

// initMainPage
function initMainPage(dataArray) {

    // first thing, populate all image options
    populateImageOptions(dataArray[0]['info_summary']['image_names'])
    populateDataSetOptions(dataSetNames)

    // then save all names in an array
    imageNamesInSelectedDataSet = dataArray[0]['info_summary']['image_names']

    // set initial image to first image and use the respective data to initialize the image Viewer
    selectedImageName = dataArray[0]['info_summary']['image_names'][0]

    // show image summary
    console.log(dataArray[0])

    // then, initialize ImageViewer instance
    imageViewer = new ImageViewer('imageViewerDrawingDiv', dataArray[0])




}

// helper functions
function populateImageOptions(imageList) {
    imageList.forEach(imageName => {
        document.querySelector('#imageSelector').innerHTML += `<option value="${imageName}" selected>${imageName}</option>`
    })
}

function populateDataSetOptions(dataSetList) {
    dataSetList.forEach(dataSetName => {
        document.querySelector('#dataSetSelector').innerHTML += `<option value="${dataSetName}" selected>${dataSetName}</option>`
    })
}

function selectImageName() {
    selectedImageName = document.querySelector('#imageSelector').value

    changeImage()
}

function changeImage() {

    // make sure you're in the right view
    document.getElementById('imageViewerDrawingDiv').classList.remove("d-none");
    document.getElementById('SetDisplayDiv').classList.add("d-none");

    // update
    imageViewer.updateImages(selectedImageName)

    // update bars
    imageViewer.updateBars(selectedImageName)
}

function changeDataSet() {
    // grab current image
    console.log('new data set selected', document.querySelector('#imageSelector').value )
    selectedDataSet= document.querySelector('#dataSetSelector').value
}

function displayAllImages (setName){
    console.log(setName)

    // minimize other
    document.getElementById('imageViewerDrawingDiv').classList.add("d-none");
    document.getElementById('SetDisplayDiv').classList.remove("d-none");
    // populate images

    let htmlString = ``

    // You can loop through an array directly by calling .forEach() on it
    imageNamesInSelectedDataSet.forEach(imageName => {

        // calculate reasonable image height for ~200 images
        let width = document.getElementById('SetDisplayDiv').getBoundingClientRect().width/25


        htmlString +=
            `<div class="col">
                <div class="row thumbnail">
                    <img src="data/rob_1/img/${setName}/${imageName}.jpeg" width="${width}" onclick="displayDetails('${imageName}')">
                </div>
            </div>`
    });

    document.getElementById('SetDisplayDiv').innerHTML = htmlString



}

function displayDetails(name = selectedImageName){

    // update selectedImageName in case it was triggered through imageClick
    console.log(name)
    selectedImageName = name

    // minimize other
    document.getElementById('imageViewerDrawingDiv').classList.remove("d-none");
    document.getElementById('SetDisplayDiv').classList.add("d-none");

    // call change image, and everything will go automatically
    changeImage()

}
