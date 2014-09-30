module.exports = {
    options: {
        sourceMap: true,
        sourceMapFilename: 'css/style.css.map',
        sourceMapRootpath: '../',
        yuicompress: false,
        compress: false
    },
    build: {
        files: [{
            "../vlad.loc/wp-content/themes/vlad-kuzmin/css/main.css": "less/main.less"
        }, {
            "css/main.css": "less/main.less"
        }]
    }
};