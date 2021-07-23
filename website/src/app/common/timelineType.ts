export type Timeline = {
    name: string,
    timeline : TimelineItem[]
}

export type TimelineItem = {
    timestamp : number;
    count : number
}

export type TimelineDisplayItem = {
    timestamp : Date,
    count : number
}