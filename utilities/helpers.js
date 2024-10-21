import moment from "moment"

export const ejsRenderer = {
     defaultLayout: (res, view, options = {}) => {
          return res.render(view, { ...options, layout: 'layouts/layout' })
     },
     useLayout: (res, view, layout, options = {}) => {
          return res.render(view, { ...options, layout })
     }
}

export const getRandomString = (length) => {
     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
     let randomcharacters = ''

     for (let i = 0; i < length; i++) {
          randomIndex = Math.floor(Math.random() * chars.length)
          randomcharacters += chars[randomIndex]
     }

     return randomcharacters;
}

export const formatStringToAgo = (dateString) => {
     return moment(dateString).fromNow();
}