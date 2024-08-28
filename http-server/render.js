//  Render
// const fetchUserdetails = (userID, callback) => {
//     console.log("fetchinf he usser details");
//     setTimeout(() =>{
//         callback(`http://image.example.com/${userID}`);
//     },500)
// };

// const downloadImage = (imageUrl, callback) => {
//     console.log("Download Image");
//     setTimeout(() => {
//         callback(`image data for ${imageUrl}`);
//     },500)
// };

// const render = (image) => {
//     console.log("remder Inder")
// }

// fetchUserdetails("john", (imageUrl) => {
//     downloadImage(imageUrl, (ImageData) =>{
//         render(ImageData)
//     })
// })

// Promise & asnc

const time = async (ms) => {
    return new Promise ((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
};

const fetchUserdetails = async (userID) => {
    console.log("fetchinf he usser details");
    await time(500);
    return `http://image.example.com/${userID}`;
};

const downloadImage =  async (imageUrl) => {
    console.log("Downloading Image");
    await time(500);
    return `http://image.example.com/${imageUrl}`;
};

const render = async (image) => {
    await time(500);
    console.log("remder Inder");
}


const run = async () => {
    const imageUrl = await fetchUserdetails("john");
    const imageData = await downloadImage(imageUrl);
    await render(imageData);
}

run();


//  without async below code
// fetchUserdetails("john")
// .then((imageUrl) => downloadImage(imageUrl))
// .then((imageData) => render(imageData))
// .catch((error) =>{
//     console.log(error);
// })