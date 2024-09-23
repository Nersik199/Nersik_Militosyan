import multer, { diskStorage } from 'multer';
import path from 'path';
import fs from 'fs';

function uploadFilePath(filePath) {
	const storage = diskStorage({
		destination: (req, file, cb) => {
			const resolvedPath = path.resolve(filePath);
			if (!fs.existsSync(resolvedPath)) {
				fs.mkdirSync(resolvedPath, { recursive: true });
			}
			cb(null, resolvedPath);
		},
		filename: (req, file, cb) => {
			const data = `${new Date().toISOString()}-${file.originalname.toLowerCase()}`;
			const name = data.replace(/\s+/gi, '').trim();
			cb(null, `${name}`);
		},
	});

	const types = ['image/png', 'image/jpg', 'image/jpeg'];

	const fileFilter = (req, file, cb) => {
		if (types.includes(file.mimetype)) {
			cb(null, true);
		} else {
			cb(null, false);
		}
	};

	return { storage, fileFilter };
}

export default filePath => {
	const { storage, fileFilter } = uploadFilePath(filePath);
	return multer({ storage, fileFilter });
};
