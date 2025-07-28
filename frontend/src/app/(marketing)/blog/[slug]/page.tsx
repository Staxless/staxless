// 'use client';

// import { ArrowLeft, Calendar, FileText, Tag } from 'lucide-react';
// import Link from 'next/link';
// import { useParams } from 'next/navigation';
// import Footer from '@/components/shared/footer';
// import Header from '@/components/shared/header';
// import { Card, CardContent } from '@/components/ui/card';
// import { getBlogContent } from '@/content/blog-content';
// import { BRAND_CONFIG } from '@/lib/brand-config';

// export default function BlogPostPage() {
//   const params = useParams();
//   const slug = params.slug as string;
//   const post = getBlogContent(slug);

//   if (!post) {
//     return (
//       <div
//         style={{
//           backgroundColor: BRAND_CONFIG.brand.colors.background,
//           minHeight: '100vh',
//         }}
//       >
//         <Header user={null} />
//         <div className="pt-20">
//           <div className="container mx-auto px-4 py-12 text-center">
//             <h1
//               className="mb-4 font-bold text-4xl"
//               style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
//             >
//               Blog Post Not Found
//             </h1>
//             <p
//               className="mb-8"
//               style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
//             >
//               The requested blog post could not be found.
//             </p>
//             <Link
//               className="inline-flex items-center space-x-2 hover:underline"
//               href="/blog"
//               style={{ color: BRAND_CONFIG.brand.colors.primary }}
//             >
//               <ArrowLeft className="h-4 w-4" />
//               <span>Back to Blog</span>
//             </Link>
//           </div>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   return (
//     <div
//       style={{
//         backgroundColor: BRAND_CONFIG.brand.colors.background,
//         minHeight: '100vh',
//       }}
//     >
//       <Header user={null} />

//       <div className="pt-20">
//         <div className="container mx-auto max-w-4xl px-4 py-12">
//           {/* Breadcrumb */}
//           <div className="mb-8 flex items-center space-x-2">
//             <Link
//               className="flex items-center space-x-1 hover:underline"
//               href="/blog"
//               style={{ color: BRAND_CONFIG.brand.colors.primary }}
//             >
//               <ArrowLeft className="h-4 w-4" />
//               <span>Blog</span>
//             </Link>
//             <span style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
//               /
//             </span>
//             <span style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
//               {post.title}
//             </span>
//           </div>

//           {/* Header */}
//           <div className="mb-8">
//             <div className="mb-4 flex items-center space-x-3">
//               <div
//                 className="rounded-lg p-2"
//                 style={{
//                   backgroundColor:
//                     BRAND_CONFIG.brand.colors.backgroundSecondary,
//                 }}
//               >
//                 <FileText
//                   className="h-6 w-6"
//                   style={{ color: BRAND_CONFIG.brand.colors.primary }}
//                 />
//               </div>
//               <h1
//                 className="font-bold text-4xl"
//                 style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
//               >
//                 {post.title}
//               </h1>
//             </div>

//             <div
//               className="flex items-center space-x-6 text-sm"
//               style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
//             >
//               <div className="flex items-center space-x-2">
//                 <Calendar className="h-4 w-4" />
//                 <span>Published: {post.publishedDate}</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Tag className="h-4 w-4" />
//                 <span>Category: {post.category}</span>
//               </div>
//             </div>
//           </div>

//           {/* Content */}
//           <Card
//             className="border"
//             style={{
//               backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
//               borderColor: BRAND_CONFIG.brand.colors.border,
//             }}
//           >
//             <CardContent className="p-8">
//               <div
//                 className="prose prose-invert max-w-none"
//                 style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
//               >
//                 {post.content.map((section) => (
//                   <div className="mb-8" key={section.content + section.type}>
//                     {section.type === 'heading' && (
//                       <h2
//                         className="mt-8 mb-4 font-bold text-2xl first:mt-0"
//                         style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
//                       >
//                         {section.content}
//                       </h2>
//                     )}
//                     {section.type === 'subheading' && (
//                       <h3
//                         className="mt-6 mb-3 font-semibold text-xl"
//                         style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
//                       >
//                         {section.content}
//                       </h3>
//                     )}
//                     {section.type === 'paragraph' && (
//                       <p
//                         className="mb-4 leading-relaxed"
//                         style={{
//                           color: BRAND_CONFIG.brand.colors.textSecondary,
//                         }}
//                       >
//                         {section.content}
//                       </p>
//                     )}
//                     {section.type === 'list' && (
//                       <ul className="mb-4 list-disc space-y-2 pl-6">
//                         {section.items?.map((item) => (
//                           <li
//                             key={item}
//                             style={{
//                               color: BRAND_CONFIG.brand.colors.textSecondary,
//                             }}
//                           >
//                             {item}
//                           </li>
//                         ))}
//                       </ul>
//                     )}
//                     {section.type === 'numbered-list' && (
//                       <ol className="mb-4 list-decimal space-y-2 pl-6">
//                         {section.items?.map((item) => (
//                           <li
//                             key={item}
//                             style={{
//                               color: BRAND_CONFIG.brand.colors.textSecondary,
//                             }}
//                           >
//                             {item}
//                           </li>
//                         ))}
//                       </ol>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>

//           {/* Contact Information */}
//           <Card
//             className="mt-8 border"
//             style={{
//               backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
//               borderColor: BRAND_CONFIG.brand.colors.border,
//             }}
//           >
//             <CardContent className="p-6">
//               <h3
//                 className="mb-3 font-semibold text-lg"
//                 style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
//               >
//                 Have Feedback?
//               </h3>
//               <p
//                 className="mb-4"
//                 style={{ color: BRAND_CONFIG.brand.colors.textSecondary }}
//               >
//                 If you have any feedback or questions about this blog post,
//                 please contact us:
//               </p>
//               <div
//                 className="space-y-2 text-sm"
//                 style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
//               >
//                 <p>Email: {BRAND_CONFIG.company.email}</p>
//                 <p>Address: {BRAND_CONFIG.company.address}</p>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// }
'use client';

import { ArrowLeft, Calendar, Clock, FileText, Tag } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Footer from '@/components/shared/footer';
import Header from '@/components/shared/header';
import { getBlogContent } from '@/content/blog-content';
import { BRAND_CONFIG } from '@/lib/brand-config';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = getBlogContent(slug);

  // Calculate estimated read time (~200 words per minute)
  const calculateReadTime = (
    content: { type: string; content: string; items?: string[] }[]
  ) => {
    const words = content.reduce((total, section) => {
      if (section.type === 'list' || section.type === 'numbered-list') {
        return total + (section.items?.join(' ') || '').split(' ').length;
      }
      return total + section.content.split(' ').length;
    }, 0);
    return Math.ceil(words / 200);
  };

  if (!post) {
    return (
      <div
        style={{
          backgroundColor: BRAND_CONFIG.brand.colors.background,
          minHeight: '100vh',
        }}
      >
        <Header user={null} />
        <div className="pt-20">
          <div className="container mx-auto px-4 py-12 text-center">
            <h1
              className="mb-4 font-bold text-4xl"
              style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
            >
              Blog Post Not Found
            </h1>
            <p
              className="mb-8"
              style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
            >
              The requested blog post could not be found.
            </p>
            <Link
              className="inline-flex items-center space-x-2 hover:underline"
              href="/blog"
              style={{ color: BRAND_CONFIG.brand.colors.primary }}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Blog</span>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: BRAND_CONFIG.brand.colors.background,
        minHeight: '100vh',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <Header user={null} />

      <div className="pt-20">
        <div className="container mx-auto max-w-3xl px-4 py-12">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center space-x-2 text-sm">
            <Link
              className="flex items-center space-x-1 hover:underline"
              href="/blog"
              style={{ color: BRAND_CONFIG.brand.colors.primary }}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Blog</span>
            </Link>
            <span style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
              /
            </span>
            <span style={{ color: BRAND_CONFIG.brand.colors.textMuted }}>
              {post.title}
            </span>
          </div>

          {/* Header */}
          <div className="mb-10">
            {/* Cover Image Placeholder (optional) */}
            {/* Uncomment and add coverImage field in Payload collection if needed */}
            {/* {post.coverImage && (
              <img
                src={post.coverImage}
                alt={`${post.title} cover image`}
                className="mb-6 w-full h-64 object-cover rounded-lg"
                style={{ borderColor: BRAND_CONFIG.brand.colors.border }}
              />
            )} */}

            <h1
              className="mb-4 font-bold text-3xl leading-tight md:text-4xl"
              style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
            >
              {post.title}
            </h1>

            <div
              className="flex flex-wrap items-center gap-4 text-sm"
              style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
            >
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{post.publishedDate}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4" />
                <span>{post.category}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{calculateReadTime(post.content)} min read</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div
            className="prose prose-invert max-w-none"
            style={{
              color: BRAND_CONFIG.brand.colors.textPrimary,
              backgroundColor: BRAND_CONFIG.brand.colors.backgroundSecondary,
              padding: '2rem',
              borderRadius: '0.5rem',
              border: `1px solid ${BRAND_CONFIG.brand.colors.border}`,
            }}
          >
            {post.content.map((section) => (
              <div className="mb-8" key={section.content + section.type}>
                {section.type === 'heading' && (
                  <h2
                    className="mt-8 mb-4 font-bold text-2xl first:mt-0"
                    style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                  >
                    {section.content}
                  </h2>
                )}
                {section.type === 'subheading' && (
                  <h3
                    className="mt-6 mb-3 font-semibold text-xl"
                    style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
                  >
                    {section.content}
                  </h3>
                )}
                {section.type === 'paragraph' && (
                  <p
                    className="mb-4 leading-relaxed"
                    style={{ color: BRAND_CONFIG.brand.colors.textSecondary }}
                  >
                    {section.content}
                  </p>
                )}
                {section.type === 'list' && (
                  <ul className="mb-4 list-disc space-y-2 pl-6">
                    {section.items?.map((item) => (
                      <li
                        key={item}
                        style={{
                          color: BRAND_CONFIG.brand.colors.textSecondary,
                        }}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {section.type === 'numbered-list' && (
                  <ol className="mb-4 list-decimal space-y-2 pl-6">
                    {section.items?.map((item) => (
                      <li
                        key={item}
                        style={{
                          color: BRAND_CONFIG.brand.colors.textSecondary,
                        }}
                      >
                        {item}
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            ))}
          </div>

          {/* Call-to-Action */}
          <div
            className="mt-10 border-t pt-6"
            style={{ borderColor: BRAND_CONFIG.brand.colors.border }}
          >
            <h3
              className="mb-4 font-semibold text-lg"
              style={{ color: BRAND_CONFIG.brand.colors.textPrimary }}
            >
              Enjoyed This Article?
            </h3>
            <p
              className="mb-4 leading-relaxed"
              style={{ color: BRAND_CONFIG.brand.colors.textSecondary }}
            >
              We’d love to hear your thoughts! Share your feedback or reach out
              with questions about this blog post.
            </p>
            <div
              className="space-y-2 text-sm"
              style={{ color: BRAND_CONFIG.brand.colors.textMuted }}
            >
              <p>
                Email:{' '}
                <a
                  href={`mailto:${BRAND_CONFIG.company.email}`}
                  style={{ color: BRAND_CONFIG.brand.colors.primary }}
                >
                  {BRAND_CONFIG.company.email}
                </a>
              </p>
              <p>Address: {BRAND_CONFIG.company.address}</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
