let VideoList = []; // Array indexed by video ID

const ResolvedVideoContainer = document.getElementById('ResolvedVideoContainer');

function CleanUp()
{

}

function ResolvingElement(id, url, status, error = 'An unknown error occured')
{
    console.log(status);
    if (status == 'Resolving')
        return `<div id="${id}"> URL: ${url} <br>Status: Resolving...</div><br>`
    if (status == 'Error')
        return `<div id="${id}"> URL: ${url} <br>Status: Error, ${error}</div><br>`
}

function ResolvedBasic(BasicResolution)
{
    for (res of BasicResolution)
    {
        // url is not valid
        if (res.id == -1) 
        {
            console.log(`Video: ${res.url} will not be resolved`);
            continue;
        }

        if (VideoList[res.id]) continue;

        const action = res.action;
        ResolvedVideoContainer.innerHTML += ResolvingElement(res.id, res.url, action)        
        const htmlElement = document.getElementById(res.id);

        VideoList[res.id] = {
            id: res.id,
            element: htmlElement,
            status: res.action
        };
    }
}

function VideoElement(id, title, desc, views, thumbnail, channel, runtime)
{
    // assumes the div has already been created
    return `
        <table>
        <tr>
            <td rowspan="3"><a href="https://www.youtube.com/watch?v=${id}"><img src="${thumbnail}"></a></td>
            <td colspan="3">${title}</td>
        </tr>
        <tr>
            <td>${channel}</td>
            <td>${views}</td>
            <td>${runtime}</td>
        </tr>
        <tr>
            <td colspan="3">${desc}</td>
        </tr>
        </table>
    `;
}

function ResolvedVideos(VideoResolution)
{
    for (res of VideoResolution)
    {
        if (!VideoList[res.id]) 
        {
            console.log(`Unexpected video, ${res.id} was not in the resolve queue`)
            continue;
        }
        
        if (VideoList[res.id].status == "Resolved") continue;
        
        const Video = VideoList[res.id];
        const htmlElement = Video.element;

        if (res.Error == true)
        {
            // there is no url element ! it is discarded on the server in place for an ID
            htmlElement.innerHTML = ResolvingElement(res.id, `https://www.youtube.com/watch?v=${res.id}`, 'Error', res.Errors[0]);
            VideoList[res.id].status = "Error";
            continue;
        }
        
        htmlElement.innerHTML = VideoElement(res.id, res.title, res.desc, res.views, res.thumbnail, res.channel, res.runtime);
        VideoList[res.id].status = "Resolved";
    }
}
