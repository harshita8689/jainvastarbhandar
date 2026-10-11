import React from 'react';
import {
  CheckCircle2,
  ExternalLink,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase/client';

export const AdminSetupGuidePage: React.FC = () => {

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-jvb-pink-600 bg-jvb-pink-50 border border-jvb-pink-200 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Interactive Onboarding</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
          Supabase & Netlify Deployment Setup Guide
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          Follow these beginner-friendly instructions to connect your online database, set up your private administrator account, and deploy to Netlify.
        </p>
      </div>

      {/* Current Configuration Status Banner */}
      <div
        className={`p-5 rounded-2xl border flex items-start gap-4 ${
          isSupabaseConfigured
            ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
            : 'bg-amber-50 border-amber-200 text-amber-950'
        }`}
      >
        <div
          className={`p-2.5 rounded-xl ${
            isSupabaseConfigured
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-amber-100 text-amber-700'
          }`}
        >
          {isSupabaseConfigured ? (
            <CheckCircle2 className="w-6 h-6" />
          ) : (
            <AlertCircle className="w-6 h-6" />
          )}
        </div>
        <div>
          <h3 className="font-serif font-bold text-base">
            {isSupabaseConfigured
              ? 'Database Connected Successfully!'
              : 'Database Unconfigured (Setup Required)'}
          </h3>
          <p className="text-xs mt-1 leading-relaxed">
            {isSupabaseConfigured
              ? 'Your application is connected to your live Supabase project. Any edits, uploads, and imports will immediately sync with the live cloud database.'
              : 'The frontend does not have active Supabase credentials yet. Complete Steps 1 through 4 below to activate your live database and image storage.'}
          </p>
        </div>
      </div>

      {/* STEP 1: CREATE SUPABASE PROJECT */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-jvb-pink-100 text-jvb-wine-800 font-bold flex items-center justify-center text-sm">
            1
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-gray-900">
              Create a Free Supabase Project
            </h3>
            <p className="text-xs text-gray-500">PostgreSQL Database & Cloud Storage</p>
          </div>
        </div>

        <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-gray-700 leading-relaxed pl-2">
          <li>
            Visit{' '}
            <a
              href="https://supabase.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-jvb-pink-600 font-semibold underline inline-flex items-center gap-1"
            >
              supabase.com <ExternalLink className="w-3 h-3" />
            </a>{' '}
            and sign in or create a free account.
          </li>
          <li>Click <strong>"New Project"</strong> and choose an organization.</li>
          <li>
            Enter Project Name: <code>jain-vastar-bhandar</code>.
          </li>
          <li>Set a strong Database Password and select the nearest region (e.g. <code>Central India / Mumbai</code>).</li>
          <li>Click <strong>"Create New Project"</strong> and wait 1–2 minutes for initialization.</li>
        </ol>
      </div>

      {/* STEP 2: RUN DATABASE SCHEMA SQL */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-jvb-pink-100 text-jvb-wine-800 font-bold flex items-center justify-center text-sm">
            2
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-gray-900">
              Run Database Schema & Security Policies (RLS)
            </h3>
            <p className="text-xs text-gray-500">Sets up products, product_images, and strict RLS rules</p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
          Open your Supabase project dashboard, navigate to the <strong>SQL Editor</strong> tab on the left sidebar, click <strong>"New Query"</strong>, paste the content of <code>supabase/schema.sql</code>, and click <strong>"Run"</strong>.
        </p>

        <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              File location in this project:
            </span>
            <span className="text-xs font-mono text-jvb-wine-700 font-semibold">
              supabase/schema.sql
            </span>
          </div>
          <p className="text-xs text-gray-600">
            This SQL script creates the tables, sets up automatic updated_at triggers, enables Row Level Security (RLS) so anonymous public visitors can only read published suits, and creates the <code>product-images</code> public storage bucket.
          </p>
        </div>
      </div>

      {/* STEP 3: CREATE ADMINISTRATOR ACCOUNT */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-jvb-pink-100 text-jvb-wine-800 font-bold flex items-center justify-center text-sm">
            3
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-gray-900">
              Create Your First Administrator Account Securely
            </h3>
            <p className="text-xs text-gray-500">Private admin user without exposing public signups</p>
          </div>
        </div>

        <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-gray-700 leading-relaxed pl-2">
          <li>In Supabase Dashboard, go to <strong>Authentication &gt; Users</strong>.</li>
          <li>Click <strong>"Add User" &gt; "Create User"</strong>.</li>
          <li>Enter your shop email (e.g. <code>admin@jainvastarbhandar.com</code>) and set a strong password.</li>
          <li>Click <strong>"Create User"</strong>.</li>
          <li>
            (Security Hardening) In <strong>Authentication &gt; Providers &gt; Email</strong>, toggle <strong>OFF "Allow new users to sign up"</strong>. This guarantees nobody from the public can ever register as an admin!
          </li>
        </ol>
      </div>

      {/* STEP 4: CONFIGURE ENVIRONMENT VARIABLES */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-jvb-pink-100 text-jvb-wine-800 font-bold flex items-center justify-center text-sm">
            4
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-gray-900">
              Get Your API Keys & Configure Environment Variables
            </h3>
            <p className="text-xs text-gray-500">Project URL and Anon/Publishable Key</p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
          In Supabase Dashboard, go to <strong>Project Settings &gt; API</strong>:
        </p>

        <div className="bg-stone-900 text-stone-100 p-4 rounded-xl text-xs font-mono space-y-2 overflow-x-auto">
          <div># In your local .env file (or Netlify Environment Variables):</div>
          <div className="text-pink-300">VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co</div>
          <div className="text-pink-300">VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ...</div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900">
          <strong>Security Note:</strong> Never paste your <code>service_role</code> secret key into frontend code. Only the <code>anon</code> / publishable key is safe to put in <code>VITE_SUPABASE_ANON_KEY</code>.
        </div>
      </div>

      {/* STEP 5: DEPLOY TO NETLIFY */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-jvb-pink-100 text-jvb-wine-800 font-bold flex items-center justify-center text-sm">
            5
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-gray-900">
              Deploying to Netlify
            </h3>
            <p className="text-xs text-gray-500">Continuous deployment from GitHub</p>
          </div>
        </div>

        <ol className="list-decimal list-inside space-y-2.5 text-xs sm:text-sm text-gray-700 leading-relaxed pl-2">
          <li>
            Commit and push your project to a private or public GitHub repository:
            <div className="bg-stone-900 text-stone-100 p-3 rounded-lg text-xs font-mono my-1">
              git init<br />
              git add .<br />
              git commit -m "Initial commit for Jain Vastar Bhandar"<br />
              git branch -M main<br />
              git remote add origin https://github.com/your-username/jain-vastar-bhandar.git<br />
              git push -u origin main
            </div>
          </li>
          <li>Log in to <a href="https://app.netlify.com" target="_blank" rel="noopener noreferrer" className="text-jvb-pink-600 underline">Netlify</a> and click <strong>"Add new site" &gt; "Import an existing project"</strong>.</li>
          <li>Select GitHub and choose your <code>jain-vastar-bhandar</code> repository.</li>
          <li>
            Netlify will automatically detect:
            <ul className="list-disc list-inside pl-4 text-xs mt-1 text-gray-600">
              <li>Build command: <code>npm run build</code></li>
              <li>Publish directory: <code>dist</code></li>
            </ul>
          </li>
          <li>
            Under <strong>"Environment variables"</strong>, add:
            <ul className="list-disc list-inside pl-4 text-xs mt-1 text-gray-600">
              <li><code>VITE_SUPABASE_URL</code> = your Supabase URL</li>
              <li><code>VITE_SUPABASE_ANON_KEY</code> = your Supabase Anon key</li>
            </ul>
          </li>
          <li>Click <strong>"Deploy jain-vastar-bhandar"</strong>.</li>
          <li>
            Our project already includes <code>public/_redirects</code> and <code>netlify.toml</code>, ensuring direct URLs (such as <code>/admin</code> and <code>/product/:slug</code>) reload seamlessly without 404 errors!
          </li>
        </ol>
      </div>

      {/* STEP 6: ROUTINE OPERATIONS */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
            6
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-gray-900">
              Daily Product Operations (No Re-deployments Needed)
            </h3>
            <p className="text-xs text-gray-500">How to manage suits without technical help</p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
          Once deployed, you <strong>never</strong> need to touch code or trigger Netlify redeployments for routine shop updates. Simply:
        </p>

        <ul className="list-disc list-inside space-y-1.5 text-xs text-gray-700 pl-2">
          <li>Log in to <code>your-website.netlify.app/admin</code> from your phone or laptop.</li>
          <li>Add new unstitched suits with multiple photos.</li>
          <li>Adjust prices or stock quantities with one click.</li>
          <li>Mark sold-out fabrics or unpublish seasonal items.</li>
          <li>Bulk import new shipments using our downloadable CSV template.</li>
        </ul>
      </div>
    </div>
  );
};
