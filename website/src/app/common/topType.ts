export type TopList = Array<TopListItem>

export type DataTopLists = {
    timestamp : number,
    hashtags : TopList,
    tags : TopList
}

export type RespDataTopList = {
    data: DataTopLists
}

export type TopListItem = {
    name : string,
    count : number
}