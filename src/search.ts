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
    site_name = '';
    host = '';
    query = '';
    all_results_url = '';
    status = SearchStatus.INIT;
    count = 0;
    results = [];
    constructor(site: string, host: string, query: string) {
        this.site_name = site;
        this.query = query;
        this.host = host;
    }
}

import axios from 'axios';

async function getDrupalApiPromise(search: Search): Promise<Search | void> {
    search.all_results_url = `${search.host}/search/?search_api_fulltext=${search.query}`;
    return await axios.get(search.host + '/api/search', {
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
}

async function getDataverseApiPromise(search: Search): Promise<Search | void> {
    search.all_results_url = `${search.host}/dataverse/asulibrary/?q=${search.query}`;
    return await axios.get(search.host + '/api/search', {
        params: {
            q: search.query,
            per_page: 10
        }
    }).then(function (response) {
        search.status = SearchStatus.TRANSFORMING;
        if (response.data.data?.items) {
            search.results = response.data.data.items.map((result) => (Object.assign(new Result(), {
                title: result.name || "[Untitled]",
                url: result.url || "",
                abstract: result.description || "",
                created: result.createdAt || ""
            }
            )));
        }
        search.count = response.data.data?.total_count ?? 0;
        return search;
    }).catch(function (error) {
        console.log(error);
    }).finally(function () {
        search.status = SearchStatus.COMPLETE;
    });
}

export async function search(repo: string, query: string): Promise<Search | void> {
    let search = undefined;
    switch (repo) {
        case 'keep': return getDrupalApiPromise(new Search('KEEP', 'https://keep.lib.asu.edu', query));
        case 'prism': return getDrupalApiPromise(new Search('PRISM', 'https://prism.lib.asu.edu', query));
        case 'dataverse': return getDataverseApiPromise(new Search('ASU Research Data Repository', 'https://dataverse.asu.edu/', query));
    }
    return search;
};
