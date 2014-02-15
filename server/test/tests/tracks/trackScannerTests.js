
console.log('paths: ' + require.node_modules)
var app = require('../../../app/app.js'),
	assert = require('assert'),
	TrackScanner = rek('TrackScanner');

var testFiles = '../../files'

exports.tests = {
	setUp : function() {
		this.trackScanner = new TrackScanner();
	},

	testAbc : function(test) {
		test.done();
		/*this.trackScanner._scanDirectory(testFiles, [], function(err, files) {
			assert(!err);
			test.done();
		})*/
	}
}

exports.testStuff = function(test) {
	console.log('test.')
	test.done();
};


//var fs = require('fs');
//process.on('uncaughtException',function(e) {
//	console.log("Caught unhandled exception: " + e);
//	console.log(" ---> : " + e.stack);
//});

//
//exports.testSomething = function(test){
//
//	var scanDir = function(path, files, complete) {
//		fs.readdir(path, function(err, nodes) {
//			var nodeCount = nodes.length;
//			directoriesToCheck = [];
//			_.each(nodes, function(node) {
//				fs.stat(path + '/' + node, function(err, stats) {
//					nodeCount--;
//					if (stats.isFile()) {
//						files.push(path + '/' + node);
//					} else {
//						directoriesToCheck.push(path + '/' + node)
//					}
//					if (nodeCount === 0) {
//						var dirsToCheckCount = directoriesToCheck.length;
//						if (dirsToCheckCount > 0) {
//							_.each(directoriesToCheck, function(dir) {
//								scanDir(dir, files, function() {
//									dirsToCheckCount--;
//									if (dirsToCheckCount === 0) {
//										complete(files)
//									}
//								})
//							})
//						} else {
//							complete(files)
//						}
//					}
//				})
//			})
//		})
//	}
//
//	scanDir('F:/vmshare/nodio-tracks', [], function(files) {
//		_.each(files, function(f) {
//			console.log(f);
//		})
//	})

//	fs.readdir('F:/vmshare/nodio-tracks', function(err, files) {
//		console.log("files ", files);
//
//		var n = files.length
//		_.each(files, function(item) {
//			console.log(item)
//			fs.stat('F:/vmshare/nodio-tracks/' + item, function(err, stats) {
//				console.log(item + ' file: ' + stats.isFile());
//				n--;
//				if (n == 0) {
//					test.done();
//				}
//			})
//		})
//
//	})
//	test.expect(1);
//	test.ok(true, "this assertion should pass");
//	console.log('hu?');
//	test.done();
//};