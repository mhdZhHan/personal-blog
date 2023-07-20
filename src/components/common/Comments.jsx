import * as React from 'react'
import Giscus from '@giscus/react'

const id = 'inject-comments'

const Comments = () => {
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
      setMounted(true)
    }, [])

    return (
        <div id={id}>
            {mounted ? (
            <Giscus
                id="comments"
                repo="mohammedshajahan7/personal-blog"
                repoId="R_kgDOJ85Niw="
                category="Blog Comments"
                categoryId="DIC_kwDOJ85Ni84CYA_s"
                mapping="url"
                term="Welcome to the comments"
                reactionsEnabled="1"
                emitMetadata="0"
                inputPosition="top"
                theme="dark"
                lang="en"
                loading="lazy"
            />
            ) : null}
        </div>
    )
}

export default Comments