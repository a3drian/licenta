export interface IExpressError extends Error {
	status?: number;    // '?' inseamna ca poate lipsi din instanta de IExpressError
}
