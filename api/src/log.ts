export const log = function (message: String | Error) {
	if (message instanceof Error) {
		// tslint:disable:no-eval
		eval(`console.error("${String(message)}")`);
		// tslint:enable
	} else {
		// tslint:disable:no-eval
		eval(`console.log("${message}")`);
		// tslint:enable
	}
};
