## what did I learn today ? 
- building app with nextjs is just a few set of patterns that repeat themselves again and again, over different pages. 
- clsx : for writing conditional styling for components 
- globals.css : at root layout, stores all css, applied to all pages. 
- public folder : for storing static assets
- next/image : Image components for optimized Images.
- next/link : Link href component for optimized prefetching 

## special files
- layout.tsx : shared components stays here 
- error.tsx : will be shown when app throws an error
- not-found.tsx : need to configure this yourself, if(!data){notFound()}, redirects user to not-found.tsx page
- page.tsx : main component for each route
- loading.tsx : based on suspense api of react, automatically replaces the UI while fetching data.

## fetching data
- fetch data using API, useState, useEffect in client component 
- fetch data directly in async server component - best 

## server components 
- supports promises
- you can use await/ async natively 
- use await to fetch data. 
- use Promise.all([]) to fetch data parallely 
- or request waterfall : next request executes only after previous is fetched, blocking 
- but what if while parallely fetching, if some request is slower than other?

## using dynamic fetching for each component, split the whole page into different dynamically fetched components with loading skeletons. 
- the concept is called streaming. 
- stream each component as it gets ready, do not wait for all the components to render. 
- stream only the slow part of app 
- or the components that fetches data inside them. 
- for making a component suspendable, streamable, we need to make it async and move all the data fetching inside it. 

## grouping components 
- create a group of components that needs to be rendered together. 
- create group, put inside a wrapper
- suspense on that wrapper so that all sub components get loaded at same time 

## using URL as state for the data rendered by server components 
- for server components, stored the state of the page, the data in the URL, 
- user action creates a new URL
- fetch this new URL 
- fetching this new Url will revalidate the content on this same page
- easy peasy 

## for client data collection 
- use client component with states
- use form to collect the states
- onSubmit - send the state object to server action
- server action performs data mutations
- mutations - create/insert, update, delete
- after every mutation, revalidate the same page to reflect new data/ changes.

## debouncing
- insteading of sending multiple server action requests when client state changes, debounce the function.
- such that it only sends one requests after a fixed timer ends from the last interaction 
- like : y, ya, yas, yash : last was yash, so request will be performed 300ms after the last input.

## next apis for 
- useSearchParams()
- usePathname()
- useRouter()

## the flow 
- user types query in client component 
- construct new url based on the input using next api helper functions
- replace the current url with new constructed
- router.replace() : to re-render the page
- this re-render will put the queryparams, searchparams into object and pass it to the component while re-rendering 
- while re-rendering, we can call database
- and render the component with fetched data

## Mutating Data 
- create, update, delete
- use server actions
- write async code and run it on server, inside server component 

## core patterns 
- fetching data : inside server components 
- mutating data : client component for collecting information, server action to execute database operations 
- interactions and collecting user data : client components 
- server actions : receives the submitted data, validate it, authorize user, perform db mutations, revalidate / redirect the user, server component fetch fresh data & renders the updated UI 

## handling errors
- user validation error : return errors as object for rendering on UI
- 404 : trigger manually : if(!data){notFound()}
- unexpecteed errors : throw the error, error.tsx will handle them.

## error recovery 
- 404 : give user buttons to go back one step behind or to dashboard / mainpage
- unexpected error : use retry button, onClick={reset}, reset() tries to re-render the same route again.
- validation error : user resubmit the form after fixing the validation errors.






