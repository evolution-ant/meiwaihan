// utils
import PropTypes from 'prop-types';
import 'src/utils/highlight';
import ReactMarkdown from 'react-markdown';
// markdown plugins
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
// import rehypeHighlight from 'rehype-highlight';
import remarkSlug from 'remark-slug';
import rehypePrism from 'rehype-prism';
import remarkAutolinkHeadings from 'remark-autolink-headings';
import { styled } from '@mui/material/styles';

// @mui
import Link from '@mui/material/Link';
// routes
import { RouterLink } from 'src/routes/components';
import copy from 'copy-to-clipboard';
//
import { useRef,createContext,useContext } from 'react';
import { Button } from '@mui/material';
import StyledMarkdown from './styles';
import Image from '../image';
// code style
// import "prismjs/themes/prism-coy.css";
// import "prismjs/themes/prism-dark.css";
import "prismjs/themes/prism-funky.css";
// import 'prismjs/themes/prism-okaidia.css';
// import "prismjs/themes/prism-solarizedlight.css";
// import "prismjs/themes/prism-tomorrow.css";
// import "prismjs/themes/prism-twilight.css";
// import "prismjs/themes/prism.css";


import 'prismjs/components/prism-python';
import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-go';
// sql
import 'prismjs/components/prism-sql';
// shell
import 'prismjs/components/prism-bash';
// jsx
import 'prismjs/components/prism-jsx';
// css
import 'prismjs/components/prism-css';

// ----------------------------------------------------------------------
const ClippySpan = styled('span')`
  content: '""';
  display: inline-block;
  padding-top: 0;
  margin-left: -2px;
  background: url(https://learn.netlify.app/images/clippy.svg) center/16px 16px no-repeat;
  background-color: rgb(54, 41, 0);
  width: 27px;
  height: 26px;
  cursor: 'pointer';
  border-radius: '0 2px 2px 0';
`;

const PreContext = createContext(false);

export default function Markdown({ sx, ...other }) {
  return (
    <StyledMarkdown sx={sx}>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw, rehypePrism, [remarkGfm, { singleTilde: false }]]}
        remarkPlugins={[
          remarkSlug,
          remarkAutolinkHeadings,
          {
            behavior: 'wrap',
            content: {
              type: 'text',
              value: '#',
            },
          },
        ]}
        components={components}
        {...other}
      />
    </StyledMarkdown>
  );
}

Markdown.propTypes = {
  sx: PropTypes.object,
};

// ----------------------------------------------------------------------
function getTextFromChildren(children) {
  if (typeof children === 'string') {
    return children;
  }
  if (Array.isArray(children)) {
    return children.map(getTextFromChildren).join('');
  }
  if (children && children.props && children.props.children) {
    return getTextFromChildren(children.props.children);
  }
  return '';
}
 const Pre= ({ children }) => {
    const text = getTextFromChildren(children);
    const ref = useRef();
    const handleCopy = async () => {
      copy(text);
      const copyButton = ref.current;
      copyButton.innerText = 'Copied!';
      setTimeout(() => {
        copyButton.innerText = 'Copy';
      }, 2000);
    };

    const pre = true;
    return (
      <div
        style={{ position: 'relative' }}
        onMouseEnter={() => {
          ref.current.style.visibility = 'visible';
        }}
        onMouseLeave={() => {
          ref.current.style.visibility = 'hidden';
        }}
      >
        <PreContext.Provider value={pre}>
          <pre>{children}</pre>
        </PreContext.Provider>
        <Button
          ref={ref}
          variant="contained"
          style={{
            position: 'absolute',
            right: 5,
            top: 5,
            visibility: 'hidden',
            width: 20,
            height: 30,
          }}
          onClick={handleCopy}
        >
          Copy
        </Button>
      </div>
    );
  };

Pre.propTypes = {
    children: PropTypes.node,
    };

    const CodeBlock = ({ node, inline, className, children, ...props }) => {
        const text = getTextFromChildren(children);
        const handleCopy = async () => {
          copy(text);
        };
        const inPre = useContext(PreContext);
      
        if (!inline || inPre) {
          return (
            <>
              {children}
            </>
          );
        }
      
        return (
          <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
            <code className={className} {...props}>
              {children}
            </code>
            <ClippySpan onClick={handleCopy} />
          </span>
        );
      };

CodeBlock.propTypes = {
    node: PropTypes.node,
    inline: PropTypes.node,
    className: PropTypes.node,
    children: PropTypes.node,
    };

const components = {
    img: ({ ...props }) => <Image alt={props.alt} sx={{ borderRadius: 2 }} {...props} />,
    a: ({ ...props }) => {
      const isHttp = props.href.includes('http');
      return isHttp ? (
        <Link target="_blank" rel="noopener" {...props} />
      ) : (
        <Link component={RouterLink} href={props.href} {...props}>
          {props.children}
        </Link>
      );
    },
    code:CodeBlock,
    pre: Pre,
    
  };