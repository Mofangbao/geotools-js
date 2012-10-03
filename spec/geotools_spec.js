var testPoints = {
	sydney:[-33.872796,151.206146],
	buenosaires:[-34.602875,-58.380449],
	newyork:[40.721119,-74.011237],
	amsterdam:[52.372103,4.894252],
	berlin:[52.527109,13.385721],
	london:[51.51283,-0.123656],
	brandenBurgerGate:[52.516279,13.377157],
	potsDammerPlatz:[52.509515,13.376599],
	moritzPlatz:[52.503663,13.410717],
	senefelderPlatz:[52.532755,13.412949],
	naturkundeMuseum:[52.531188,13.381921],
	rosenthalerPlatz:[52.529948,13.401361],
	oranienburgerTor:[52.525339,13.38707]
};

describe("Geohash encode/decode ", function() {

	var decodedGeohashes = [[0.10000004433095455, -0.09999996051192284, "ebpbtdpntc6e"], [52.5308879557997, 13.394904043525457, "u33dbfcyegk2"]];
	var encodedGeohashes = [[0.1, -0.1, "ebpbtdpntc6e"], [52.530888, 13.394904, "u33dbfcyegk2"]];
	

	it("should decode geohash", function() {
		for (var i = 0; i < decodedGeohashes.length; i++) {
			var latitude = decodedGeohashes[i][0];
			var longitude = decodedGeohashes[i][1];
			var geohash = decodedGeohashes[i][2];
			var point = geotools.decode(geohash);
			expect(point[0]).toBe(latitude);
			expect(point[1]).toBe(longitude);
		};
	});

	it("encode should encode geohash", function() {
		for ( i = 0; i < encodedGeohashes.length; i++) {
			var latitude = encodedGeohashes[i][0];
			var longitude = encodedGeohashes[i][1];
			var geohash = encodedGeohashes[i][2];
			expect(geotools.encode(latitude, longitude)).toBe(geohash);
			expect(geotools.encode(latitude, longitude, 5)).toBe(geohash.substring(0, 5));
		};
	});

	it("should reject length > 12", function() {
		expect(function() {
			geotools.encode(1, 2, 13)
		}).toThrow();
	});

	it("should reject length < 1", function() {
		expect(function() {
			geotools.encode(1, 2, -1)
		}).toThrow();
	});
});

describe("Geohash decode_bbox ", function() {
	it("should decode to a bounding box", function() {
		var bbox = geotools.decode_bbox("u33dbfcyegk2");
		expect(bbox[0] < 52.530888);
		expect(bbox[1] > 52.530888);
		expect(bbox[2] < 13.394904);
		expect(bbox[3] > 13.394904);
	});
});

describe("bounding box for polygon",function(){
	it("should calculate boundingbox for a polygon", function() {
		var polygon = [testPoints.berlin,testPoints.newyork,testPoints.buenosaires];
		var bbox = geotools.bboxForPolygon(polygon);
		expect(bbox[0]>testPoints.amsterdam[0]);
	});
});

describe("bounding box containment", function() {
	var bbox = geotools.bboxForPolygon([testPoints.berlin,testPoints.london,testPoints.buenosaires]);

	it("should contain amsterdam", function(){
		expect(geotools.bboxContains(bbox, testPoints.amsterdam[0],testPoints.amsterdam[1]));		
	});
	it("should not contain sydney", function(){
		expect(!geotools.bboxContains(bbox, testPoints.sydney[0],testPoints.sydney[1]));		
	});
});

describe("polygon containment", function() {
	var polygon = [testPoints.berlin,testPoints.london,testPoints.buenosaires];

	it("should contain amsterdam", function(){
		expect(geotools.polygonContains(polygon, testPoints.amsterdam[0],testPoints.amsterdam[1]));		
	});
	it("should not contain sydney", function(){
		expect(!geotools.polygonContains(polygon, testPoints.sydney[0],testPoints.sydney[1]));		
	});
});

describe("rounding to specified number of decimals", function() {
	it("should round to two decimals", function(){
		expect(geotools.roundToDecimals(1.1234,2)).toBe(1.12);
	});
});

describe("check if lines cross", function() {
	it("should cross", function() {
		expect(geotools.linesCross(1, 1, 2, 2, 1, 2, 2, 1));
		expect(geotools.linesCross(1, 1, 1, 10, 1, 3, 1, 4));
		expect(geotools.linesCross(1, 666, 10, 666, 3, 666, 4, 666));
	});
	it("should not cross", function() {
		expect(!geotools.linesCross(1, 2, 3, 4, 10, 20, 20, 10));
		expect(!geotools.linesCross(1, 1, 2, 2, 2, 2, 3, 3));
		expect(!geotools.linesCross(1, 1, 1, 5, 1, 6, 1, 10));
		expect(!geotools.linesCross(1, 666, 5, 666, 6, 666, 10, 666));
	});
});
