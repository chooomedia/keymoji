/*
Route matcher utility for pattern matching and parameter extraction.
Provides route pattern matching with parameter extraction from URL paths.
Handles dynamic route parameters and wildcard matching.
*/
export interface MatchResult {
    isMatch: boolean;
    params: Record<string, string>;
}

export function matchRoute(
    pattern: string,
    path: string,
    exact: boolean = false
): MatchResult {
    const routePattern = pattern
        .replace(/:([^/]+)/g, '([^/]+)')
        .replace(/\*/g, '.*');

    const regex = new RegExp(`^${routePattern}${exact ? '$' : ''}`);
    const match = path.match(regex);

    if (match) {
        const params: Record<string, string> = {};
        const paramNames = pattern.match(/:([^/]+)/g) || [];

        paramNames.forEach((param, index) => {
            const name = param.slice(1);
            const value = match[index + 1];
            if (value !== undefined) {
                params[name] = value;
            }
        });

        return { isMatch: true, params };
    }

    return { isMatch: false, params: {} };
}
