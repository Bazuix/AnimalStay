export const errorMiddleware = (err: any, _req: any, res: any, _next: any) => {
    console.error(err);
    res.status(500).json({ message: err.message });
};