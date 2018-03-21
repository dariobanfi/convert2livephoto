const fs = require('fs');
const path = require('path');

const xmlMetadata =
	'<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd"><plist version="1.0"><dict><key>PFVideoComplementMetadataVersionKey</key><string>1</string></dict></plist>';

const copySync = (src, dest) => {
	fs.createReadStream(src).pipe(fs.createWriteStream(dest));
}

fs.readdir(process.cwd(), function(err, items) {
	if (!err) {
		for (var i = 0; i < items.length; i++) {
			const fileExt = path.extname(items[i])
			const fileName = path.basename(items[i], fileExt)
			if ((fileExt == '.jpg') && items.includes(`${fileName}.mov`)) {
				const livePhotoDir = `./${fileName}.pvt`;
				// Create .pvt container
				fs.mkdirSync(livePhotoDir);
				// Copy jpg & mov
				copySync(
					`./${fileName}.mov`,
					`./${livePhotoDir}/${fileName}.mov`
				);
				copySync(
					`./${fileName}.jpg`,
					`./${livePhotoDir}/${fileName}.jpg`
				);
				// Create metadata file
				fs.writeFile(`./${livePhotoDir}/metadata.plist`, xmlMetadata, (err) => {});
				// Cleanup
				fs.unlink(`./${fileName}.jpg`, (err) => {});
				fs.unlink(`./${fileName}.mov`, (err) => {});
			}
		}
	}
});
