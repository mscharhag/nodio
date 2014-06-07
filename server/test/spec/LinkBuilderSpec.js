'use strict';
require('../test.js');

var app = rek('app'),
	links = rek('LinkBuilder');

describe('LinkBuilder tests', function() {

	describe('when a base url is used', function() {
		var builder;

		beforeEach(function() {
			builder = links('/foo');
		});

		it('should prepend the base url to the self link', function() {
			expect(builder.self('/bar').build()).toEqual({ self : '/foo/bar' })
		});

		it('should prepend the base url to link urls', function() {
			expect(builder.add('link', '/bar').build()).toEqual({ link : '/foo/bar' })
		});

		it('should not prepend the base url if the absolute option is used', function() {
			expect(builder.add('link', '/bar', {absolute: true}).build()).toEqual({ link : '/bar' })
		});

		it('should return / as self link if / is passed', function() {
			expect(builder.self('/').build()).toEqual({self: '/foo'})
		});

		it('should return / as link if / is passed', function() {
			expect(builder.add('link', '/').build()).toEqual({link: '/foo'})
		});
	});

	describe('when a condition is used', function() {

		it('should not add the link if the condition is false', function() {
			expect(links().addWhen(false, 'link', '/bar').build()).toEqual({})
		});

		it('should add the link if the condition is true', function() {
			expect(links().addWhen(true, 'link', '/bar').build()).toEqual({ link: '/bar'})
		})
	});

	it('should return / as self link if / is passed', function() {
		expect(links().self('/').build()).toEqual({self: '/'})
	});

	it('should return / as link if / is passed', function() {
		expect(links().add('link', '/').build()).toEqual({link: '/'})
	});


});
