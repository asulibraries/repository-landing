class Result {
    title: string;
    url: string;
    abstract: string;
    created: string;
}

enum SearchStatus {
    INIT = "initiated",
    WAITING = 'waiting',
    TRANSFORMING = 'transforming',
    COMPLETE = 'completed'
}

interface SearchConstructor {
    new (query: string): Search;
}

interface Search {
    status: SearchStatus,
    count?: number,
    results?: Array<Result>;
}


class KeepSearch implements Search {
    baseUrl = 'https://keep.lib.asu.edu/api/search'
    status = SearchStatus.INIT;
    count = 0;
    results = [];
    constructor(query: string) {
        // Drupal request code
        // e.g. https://keep.lib.asu.edu/api/search?search_api_fulltext=Urban+Planning&format=json&items_per_page=10
    //     $request_url = $base_url . '?search_api_fulltext=' . $term . '&q=' . $term .
    //     '&format=json' . (($limit > 10) ? "items_per_page=" . $limit : "");
    //   $request = $this->httpClient->request('GET', $request_url);

        // Proof-of-concept test results:
        this.results = [
            { title: 'title', url: 'https://example.net', abstract: 'This is an abstract', created: '2024' },
            { title: 'title', url: 'https://example.net', abstract: 'This is an abstract', created: '2024' }];
        this.status = SearchStatus.COMPLETE;
    }
}


class PrismSearch implements Search {
    status = SearchStatus.INIT;
    count = 0;
    constructor(query: string) {
        throw new Error("Method not implemented.");
    }
}

class DataverseSearch implements Search {
    status = SearchStatus.INIT;
    count = 0;
    constructor(query: string) {
        throw new Error("Method not implemented.");
    }
}

type SearchFunction = (a: string) => Array<Search>;
export function search(repo: string, query: string): Search  {
    switch (repo) {
        case 'keep': return new KeepSearch(query);
        case 'prism': return new PrismSearch(query);
        case 'dataverse': return new DataverseSearch(query);
    }
    return null;
    
};
