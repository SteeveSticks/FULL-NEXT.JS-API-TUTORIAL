export function logMiddleware(req: Request) {
  // req.method -> POST + " Join the POST and the URL to form a single string " + req.url -> users
  return { response: req.method + " " + req.url };
}
