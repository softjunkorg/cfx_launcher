// Request
function request<T = any>(name: string, ...args: any[]): Promise<T> {
  return (window as any).__api.request(name, ...args);
}

// Listen
function listen(
  name: string,
  callback: (event: any, ...args: any[]) => any
): (event: any, ...args: any[]) => any {
  return (window as any).__api.listen(name, callback);
}

// Off
function off(name: string, callback: (event: any, ...args: any[]) => any) {
  return (window as any).__api.off(name, callback);
}

export { request, listen, off };
