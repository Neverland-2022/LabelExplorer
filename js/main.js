let selectedImageName = 'm_3807502_se_18_1_naip-new_cp10';

console.log(imageNames)

// first, populate image options
populateImageOptions(imageNames)

// helper functions
function populateImageOptions(imageList) {
    imageList.forEach(imageName => {
        document.querySelector('#imageSelector').innerHTML += `<option value="${imageName}" selected>${imageName}</option>`
    })
}

function changeSet() {
    selectedImageName = document.querySelector('#imageSelector').value

    console.log(selectedImageName)
    document.getElementById('gt_label').src = `data/final_res/ground_truth_masks/${selectedImageName}.png`
    document.getElementById('gt_sat_img').src = `data/final_res/original_images_real/${selectedImageName}.png`
    document.getElementById('syn_sat_img').src = `data/final_res/original_images_syn/${selectedImageName}.png`

    document.getElementById('real_gen_lm_0').src = `data/final_res/${selectedImageName}/checkpoints_syn_000_checkpoint_epoch5_mix_0_real.png`
    document.getElementById('real_gen_lm_25').src = `data/final_res/${selectedImageName}/checkpoints_syn_025_checkpoint_epoch5_mix_25_real.png`
    document.getElementById('real_gen_lm_50').src = `data/final_res/${selectedImageName}/checkpoints_syn_050_checkpoint_epoch5_mix_50_real.png`
    document.getElementById('real_gen_lm_75').src = `data/final_res/${selectedImageName}/checkpoints_syn_075_checkpoint_epoch5_mix_75_real.png`
    document.getElementById('real_gen_lm_100').src = `data/final_res/${selectedImageName}/checkpoints_syn_100_checkpoint_epoch5_mix_100_real.png`
    document.getElementById('real_gen_lm_200').src = `data/final_res/${selectedImageName}/checkpoints_syn_200_checkpoint_epoch5_mix_100_real.png`

    document.getElementById('real_syn_lm_0').src = `data/final_res/${selectedImageName}/checkpoints_syn_000_checkpoint_epoch5_mix_0_syn.png`
    document.getElementById('real_syn_lm_25').src = `data/final_res/${selectedImageName}/checkpoints_syn_025_checkpoint_epoch5_mix_25_syn.png`
    document.getElementById('real_syn_lm_50').src = `data/final_res/${selectedImageName}/checkpoints_syn_050_checkpoint_epoch5_mix_50_syn.png`
    document.getElementById('real_syn_lm_75').src = `data/final_res/${selectedImageName}/checkpoints_syn_075_checkpoint_epoch5_mix_75_syn.png`
    document.getElementById('real_syn_lm_100').src = `data/final_res/${selectedImageName}/checkpoints_syn_100_checkpoint_epoch5_mix_100_syn.png`
    document.getElementById('real_syn_lm_200').src = `data/final_res/${selectedImageName}/checkpoints_syn_200_checkpoint_epoch5_mix_100_syn.png`

}

// global class instances
let legend, bcb_0, bcb_1, bcb_2, bcb_3, bcb_4, bcb_5, lineChart


// load data using promises
let promises = [
    d3.json("data/final_res/syn_000_real_scores.json"),
    d3.json("data/final_res/syn_000_syn_scores.json"),

    d3.json("data/final_res/syn_025_real_scores.json"),
    d3.json("data/final_res/syn_025_syn_scores.json"),


    d3.json("data/final_res/syn_050_real_scores.json"),
    d3.json("data/final_res/syn_050_syn_scores.json"),


    d3.json("data/final_res/syn_075_real_scores.json"),
    d3.json("data/final_res/syn_075_syn_scores.json"),


    d3.json("data/final_res/syn_100_real_scores.json"),
    d3.json("data/final_res/syn_100_syn_scores.json"),


    d3.json("data/final_res/syn_200_real_scores.json"),
    d3.json("data/final_res/syn_200_syn_scores.json")
];


Promise.all(promises)
    .then(function (data) {
        startApp(data)
    })
    .catch(function (err) {
        console.log(err)
    });


function startApp(data){

    console.log(data)
    // select image set
    changeSet()

    // create legend
    legend = new LegendVis("legendDiv")

    // create new instance
    bcb_0 = new BreadCrumbBar("bcb_0", data[0], data[1], `Real & Syn DICE for syn_000`);
    bcb_1 = new BreadCrumbBar("bcb_1", data[2], data[3], `Real & Syn DICE for syn_025 `);
    bcb_2 = new BreadCrumbBar("bcb_2", data[4], data[5], `Real & Syn DICE for syn_050 `);
    bcb_3 = new BreadCrumbBar("bcb_3", data[6], data[7], `Real & Syn DICE for syn_075 `);
    bcb_4 = new BreadCrumbBar("bcb_4", data[8], data[9], `Real & Syn DICE for syn_100 `);
    bcb_5 = new BreadCrumbBar("bcb_5", data[10], data[11], `Real & Syn DICE for syn_200 `);

    // create new
    lineChart = new MultiLineVis("lineChartDiv", data, 'title');


    let scoreTableHTML = ``;

    let methodNames = [
        'syn_000','syn_000',
        'syn_025','syn_025',
        'syn_050','syn_050',
        'syn_075', 'syn_075',
        'syn_100', 'syn_100',
        'syn_200', 'syn_200',
    ]

    data.forEach( (json,i) => {

        if ( (i+1) % 2){
            scoreTableHTML += `<div class="row" style="height: 4vh; font-size: 1vh">
                                                <div class="col">
                                                    <div class="row justify-content-center" style="height: 100%">
                                                        <span class="align-self-center">
                                                            ${methodNames[i]}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div class="col">
                                                    <div class="row justify-content-center" style="height: 100%; background: rgba(185,224,255,0.50)">
                                                        <span class="align-self-center">
                                                            ${json["Labelwise_DICE"][0].toFixed(3)} | ${data[i + 1]["Labelwise_DICE"][0].toFixed(3)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div class="col">
                                                    <div class="row justify-content-center" style="height: 100%; background: rgba(40,84,48,0.50)">
                                                        <span class="align-self-center">
                                                            ${json["Labelwise_DICE"][1].toFixed(3)} | ${data[i + 1]["Labelwise_DICE"][1].toFixed(3)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div class="col">
                                                    <div class="row justify-content-center" style="height: 100%; background: rgba(164,190,123,0.50)">
                                                        <span class="align-self-center">
                                                            ${json["Labelwise_DICE"][2].toFixed(3)} | ${data[i + 1]["Labelwise_DICE"][2].toFixed(3)}
                                                        </span>
                                                    </div>
                                                </div>
                                               <div class="col">
                                                    <div class="row justify-content-center" style="height: 100%; background: rgba(229,217,182,0.5)">
                                                        <span class="align-self-center">
                                                            ${json["Labelwise_DICE"][3].toFixed(3)} | ${data[i + 1]["Labelwise_DICE"][3].toFixed(3)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div class="col">
                                                    <div class="row justify-content-center" style="height: 100%; background: rgba(235,100,64,0.50)">
                                                        <span class="align-self-center">
                                                            ${json["Labelwise_DICE"][4].toFixed(3)} | ${data[i + 1]["Labelwise_DICE"][4].toFixed(3)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div class="col">
                                                    <div class="row justify-content-center" style="height: 100%; background: rgba(119,67,219,0.5)">
                                                        <span class="align-self-center">
                                                            ${json["Labelwise_DICE"][5].toFixed(3)} | ${data[i + 1]["Labelwise_DICE"][5].toFixed(3)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div class="col">
                                                    <div class="row justify-content-center" style="height: 100%;">
                                                        <span class="align-self-center">
                                                            ${json["DICE"].toFixed(3)} | ${data[i + 1]["DICE"].toFixed(3)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>`
        }

    })

    document.getElementById("scoreTable").innerHTML += scoreTableHTML


}

