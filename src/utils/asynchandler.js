const asynhandler = (requesthandler) => (req, res, next) => {
  return  Promise.resolve(requesthandler(req, res, next)).catch((error) => {
	next(error);
  });
};
export default asynhandler;