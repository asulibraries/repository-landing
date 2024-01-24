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

class Search {
    host = '';
    query = '';
    status = SearchStatus.INIT;
    count = 0;
    results = [];
    constructor(host: string, query: string) {
        this.query = query;
        this.host = host;
    }
}

import axios from 'axios';

async function getDrupalApiPromise(search: Search): Promise<Search | void> {
    const completed_search = await axios.get(search.host + '/api/search', {
        params: {
            search_api_fulltext: search.query,
            format: 'json',
            items_per_page: 10
        }
    })
        .then(function (response) {
            search.status = SearchStatus.TRANSFORMING;
            if (response.data.search_results) {
                search.results = response.data.search_results.map((result) => (Object.assign(new Result(), {
                    title: result.complex_title || "[Untitled]",
                    url: result.field_handle || `${this.host}/node/${result.nid}`,
                    abstract: result.field_rich_description || "",
                    created: result.field_edtf_date_created || ""
                }
                )));
            }
            search.count = response.data.pager?.count ?? 0;
            return search;
        })
        .catch(function (error) {
            console.log(error);
        })
        .finally(function () {
            search.status = SearchStatus.COMPLETE;
        });
    return completed_search;
}


export async function search(repo: string, query: string): Promise<Search | void> {
    let search = undefined;
    switch (repo) {
        case 'keep': return getDrupalApiPromise(new Search('https://keep.lib.asu.edu', query));
        case 'prism': return getDrupalApiPromise(new Search('https://prism.lib.asu.edu', query));
        // case 'dataverse': search = new DataverseSearch(query); break;
    }
    return search;
};
