'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (initialOptions) {
    if (!initialOptions || !initialOptions.files) {
        throw new Error('You must pass webfont a `files` glob');
    }

    var files = initialOptions.files;


    var options = Object.assign({}, {
        ascent: undefined, // eslint-disable-line no-undefined
        centerHorizontally: false,
        cssTemplateClassName: null,
        cssTemplateFontName: null,
        cssTemplateFontPath: './',
        descent: 0,
        fixedWidth: false,
        fontHeight: null,
        fontId: null,
        fontName: 'webfont',
        fontStyle: '',
        fontWeight: '',
        formats: ['svg', 'ttf', 'eot', 'woff', 'woff2'],
        formatsOptions: {
            ttf: {
                copyright: null,
                ts: null,
                version: null
            }
        },
        glyphTransformFn: null,
        // Maybe allow setup from CLI
        maxConcurrency: _os2.default.cpus().length,
        metadata: null,
        metadataProvider: null,
        normalize: false,
        prependUnicode: false,
        round: 10e12,
        startUnicode: 0xEA01,
        unicodeArray: [],
        template: null,
        verbose: false
    }, initialOptions);

    var glyphsData = [];

    return buildConfig({
        configFile: options.configFile
    }).then(function (loadedConfig) {
        options = (0, _mergeDeep2.default)({}, options, loadedConfig);

        return (0, _globby2.default)([].concat(files)).then(function (foundFiles) {
            var filteredFiles = foundFiles.filter(function (foundFile) {
                return _path2.default.extname(foundFile) === '.svg';
            });

            if (filteredFiles.length === 0) {
                throw new Error('Files glob patterns specified did not match any files');
            }

            options.foundFiles = foundFiles;

            return getGlyphsData(foundFiles, options);
        }).then(function (returnedGlyphsData) {
            glyphsData = returnedGlyphsData;

            return svgIcons2svgFontFn(returnedGlyphsData, options);
        })
        // Maybe add ttfautohint
        .then(function (svgFont) {
            var result = {};

            result.svg = svgFont;

            result.ttf = Buffer.from((0, _svg2ttf2.default)(result.svg.toString(), options.formatsOptions && options.formatsOptions.ttf ? options.formatsOptions.ttf : {}).buffer);

            if (options.formats.indexOf('eot') !== -1) {
                result.eot = Buffer.from((0, _ttf2eot2.default)(result.ttf).buffer);
            }

            if (options.formats.indexOf('woff') !== -1) {
                result.woff = Buffer.from((0, _ttf2woff2.default)(result.ttf, {
                    metadata: options.metadata
                }).buffer);
            }

            if (options.formats.indexOf('woff2') !== -1) {
                result.woff2 = (0, _ttf2woff4.default)(result.ttf);
            }

            return result;
        }).then(function (result) {
            if (!options.template) {
                return result;
            }

            var buildInTemplateDirectory = _path2.default.resolve(__dirname, '../templates');

            return (0, _globby2.default)(buildInTemplateDirectory + '/**/*').then(function (buildInTemplates) {
                var supportedExtensions = buildInTemplates.map(function (buildInTemplate) {
                    return _path2.default.extname(buildInTemplate.replace('.njk', ''));
                });

                var templateFilePath = options.template;

                if (supportedExtensions.indexOf('.' + options.template) !== -1) {
                    result.usedBuildInStylesTemplate = true;

                    _nunjucks2.default.configure(_path2.default.join(__dirname, '../'));

                    templateFilePath = buildInTemplateDirectory + '/template.' + options.template + '.njk';
                } else {
                    templateFilePath = _path2.default.resolve(templateFilePath);
                }

                var nunjucksOptions = (0, _mergeDeep2.default)({}, {
                    // Maybe best solution is return metadata object of glyph.
                    glyphs: glyphsData.map(function (glyphData) {
                        if (typeof options.glyphTransformFn === 'function') {
                            options.glyphTransformFn(glyphData.metadata);
                        }

                        return glyphData.metadata;
                    })
                }, options, {
                    className: options.cssTemplateClassName ? options.cssTemplateClassName : options.fontName,
                    fontName: options.cssTemplateFontName ? options.cssTemplateFontName : options.fontName,
                    fontPath: options.cssTemplateFontPath
                });

                result.styles = _nunjucks2.default.render(templateFilePath, nunjucksOptions);

                return result;
            });
        }).then(function (result) {
            if (options.formats.indexOf('svg') === -1) {
                delete result.svg;
            }

            if (options.formats.indexOf('ttf') === -1) {
                delete result.ttf;
            }

            result.config = options;

            return result;
        });
    });
};

var _stream = require('stream');

var _cosmiconfig = require('cosmiconfig');

var _cosmiconfig2 = _interopRequireDefault(_cosmiconfig);

var _asyncThrottle = require('async-throttle');

var _asyncThrottle2 = _interopRequireDefault(_asyncThrottle);

var _metadata = require('svgicons2svgfont/src/metadata');

var _metadata2 = _interopRequireDefault(_metadata);

var _filesorter = require('svgicons2svgfont/src/filesorter');

var _filesorter2 = _interopRequireDefault(_filesorter);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _globby = require('globby');

var _globby2 = _interopRequireDefault(_globby);

var _mergeDeep = require('merge-deep');

var _mergeDeep2 = _interopRequireDefault(_mergeDeep);

var _nunjucks = require('nunjucks');

var _nunjucks2 = _interopRequireDefault(_nunjucks);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _svg2ttf = require('svg2ttf');

var _svg2ttf2 = _interopRequireDefault(_svg2ttf);

var _svgicons2svgfont = require('svgicons2svgfont');

var _svgicons2svgfont2 = _interopRequireDefault(_svgicons2svgfont);

var _ttf2eot = require('ttf2eot');

var _ttf2eot2 = _interopRequireDefault(_ttf2eot);

var _ttf2woff = require('ttf2woff');

var _ttf2woff2 = _interopRequireDefault(_ttf2woff);

var _ttf2woff3 = require('ttf2woff2');

var _ttf2woff4 = _interopRequireDefault(_ttf2woff3);

var _xml2js = require('xml2js');

var _xml2js2 = _interopRequireDefault(_xml2js);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getGlyphsData(files, options) {
    var metadataProvider = options.metadataProvider || (0, _metadata2.default)({
        prependUnicode: options.prependUnicode,
        startUnicode: options.startUnicode
    });

    var sortedFiles = files.sort(function (fileA, fileB) {
        return (0, _filesorter2.default)(fileA, fileB);
    });
    var xmlParser = new _xml2js2.default.Parser();
    var throttle = (0, _asyncThrottle2.default)(options.maxConcurrency);

    return Promise.all(sortedFiles.map(function (srcPath, srcIndex) {
        return throttle(function () {
            return new Promise(function (resolve, reject) {
                var glyph = _fs2.default.createReadStream(srcPath);
                var glyphContents = '';

                return glyph.on('error', function (glyphError) {
                    return reject(glyphError);
                }).on('data', function (data) {
                    glyphContents += data.toString();
                }).on('end', function () {
                    // Maybe bug in xml2js
                    if (glyphContents.length === 0) {
                        return reject(new Error('Empty file ' + srcPath));
                    }

                    return xmlParser.parseString(glyphContents, function (error) {
                        if (error) {
                            return reject(error);
                        }

                        var glyphData = {
                            contents: glyphContents,
                            srcPath: srcPath
                        };

                        return resolve(glyphData);
                    });
                });
            });
        }).then(function (glyphData) {
            return new Promise(function (resolve, reject) {
                metadataProvider(glyphData.srcPath, options.unicodeArray[srcIndex], function (error, metadata) {
                    if (error) {
                        return reject(error);
                    }

                    glyphData.metadata = metadata;

                    return resolve(glyphData);
                });
            });
        });
    }));
}

function svgIcons2svgFontFn(glyphsData, options) {
    var result = '';

    return new Promise(function (resolve, reject) {
        var fontStream = (0, _svgicons2svgfont2.default)({
            ascent: options.ascent,
            centerHorizontally: options.centerHorizontally,
            descent: options.descent,
            fixedWidth: options.fixedWidth,
            fontHeight: options.fontHeight,
            fontId: options.fontId,
            fontName: options.fontName,
            fontStyle: options.fontStyle,
            fontWeight: options.fontWeight,
            // eslint-disable-next-line no-console, no-empty-function
            log: options.vebose ? console.log.bind(console) : function () {},
            metadata: options.metadata,
            normalize: options.normalize,
            round: options.round
        }).on('finish', function () {
            return resolve(result);
        }).on('data', function (data) {
            result += data;
        }).on('error', function (error) {
            return reject(error);
        });

        glyphsData.forEach(function (glyphData) {
            var glyphStream = new _stream.Readable();

            glyphStream.push(glyphData.contents);
            glyphStream.push(null);

            glyphStream.metadata = glyphData.metadata;

            fontStream.write(glyphStream);
        });

        fontStream.end();
    });
}

function buildConfig(options) {
    var cosmiconfigOptions = {
        argv: true,
        // Allow extensions on rc filenames
        rcExtensions: true
    };

    var searchPath = process.cwd();
    var configPath = null;

    if (options.configFile) {
        searchPath = null;
        configPath = _path2.default.resolve(process.cwd(), options.configFile);
    }

    return (0, _cosmiconfig2.default)('webfont', cosmiconfigOptions).load(searchPath, configPath).then(function (result) {
        if (!result) {
            return {};
        }

        return result.config;
    });
}