const urls = {
  home: '/',
  search: '/search',

  login: '/login',
  logout: '/logout',
  join: '/join',

  // users
  upload: '/upload',
  profileMe: '/profile/me',
  profileOther: '/profile/:userId',
  editProfile: '/editProfile',
  changePassword: '/changePassword',

  // videos
  videoDetail: '/videoDetail',
  editVideo: '/editVideo',
  deleteVideo: '/deleteVideo',

  // github
  githubLogin: '/auth/github',
  githubLoginCallback: '/auth/github/callback',

  // facebook
  facebookLogin: '/auth/facebook',
  facebookLoginCallback: '/auth/facebook/callback',

  api: {
    registerView: '/view/:videoId',
    addComment: '/comment/add',
    deleteComment: '/comment/delete'
  }
};

export default urls;
