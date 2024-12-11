import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import changelogContent from '../../CHANGELOG.md?raw';

export function Changelog() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-8">Changelog</h1>
        <div className="bg-white shadow-sm rounded-lg p-6 sm:p-8">
          <ReactMarkdown 
            className="prose prose-gray max-w-none
              prose-headings:font-semibold
              prose-h1:text-2xl prose-h1:mb-4
              prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4
              prose-p:text-gray-600 prose-p:leading-relaxed
              prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
              prose-ul:my-4 prose-li:text-gray-600
              prose-code:text-sm prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded"
          >
            {changelogContent}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
} 