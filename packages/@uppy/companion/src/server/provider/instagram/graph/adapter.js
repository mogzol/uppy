const querystring = require('node:querystring')

const MEDIA_TYPES = Object.freeze({
  video: 'VIDEO',
  carousel: 'CAROUSEL_ALBUM',
  image: 'IMAGE',
})

const isVideo = (item) => item.media_type === MEDIA_TYPES.video

exports.isFolder = (item) => { // eslint-disable-line no-unused-vars
  return false
}

exports.getItemIcon = (item) => {
  return isVideo(item) ? item.thumbnail_url : item.media_url
}

exports.getItemSubList = (item) => {
  const newItems = []
  item.data.forEach((subItem) => {
    if (subItem.media_type === MEDIA_TYPES.carousel) {
      subItem.children.data.forEach((i) => newItems.push(i))
    } else {
      newItems.push(subItem)
    }
  })
  return newItems
}

exports.getItemName = (item, index) => {
  const ext = isVideo(item) ? 'mp4' : 'jpeg'
  // adding index, so the name is unique
  return `Instagram ${item.timestamp}${index}.${ext}`
}

exports.getMimeType = (item) => {
  return isVideo(item) ? 'video/mp4' : 'image/jpeg'
}

exports.getItemId = (item) => item.id

exports.getItemRequestPath = (item) => item.id

exports.getItemModifiedDate = (item) => item.timestamp

exports.getItemThumbnailUrl = (item) => exports.getItemIcon(item)

exports.getNextPagePath = (data, currentQuery, currentPath) => {
  if (!data.paging || !data.paging.cursors) {
    return null
  }

  const query = { ...currentQuery, cursor: data.paging.cursors.after }
  return `${currentPath || ''}?${querystring.stringify(query)}`
}
