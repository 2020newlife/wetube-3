import mongoose from 'mongoose';

mongoose.connect(process.env.DATABASE_MLAB, {
  useNewUrlParser: true,
  useFindAndModify: false
});

const db = mongoose.connection;

db.once('open', () => {
  console.log('✅  DB Connected');
});

db.on('error', error => {
  console.log(`❌  DB Error: ${error}`);
});

// export const videos = [
//     {
//         id: 111,
//         title: "Video Title 1",
//         description: "Video Description",
//         views: 24,
//         videoFile: "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4",
//         creator: {
//             id: 123123,
//             name: "mj",
//             email: "mj@mj.com"
//         }
//     },
//     {
//         id: 222,
//         title: "Video Title 2",
//         description: "Video Description",
//         views: 24,
//         videoFile: "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4",
//         creator: {
//             id: 123123,
//             name: "mj",
//             email: "mj@mj.com"
//         }
//     },
//     {
//         id: 333,
//         title: "Video Title 3",
//         description: "Video Description",
//         views: 24,
//         videoFile: "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4",
//         creator: {
//             id: 123123,
//             name: "mj",
//             email: "mj@mj.com"
//         }
//     },
//     {
//         id: 444,
//         title: "Video Title 4",
//         description: "Video Description",
//         views: 24,
//         videoFile: "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4",
//         creator: {
//             id: 123123,
//             name: "mj",
//             email: "mj@mj.com"
//         }
//     }
// ]
