// Portfolio.tsx - Updated with Academic Professional Design
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface StockData {
  price: number;
  change: number;
  name: string;
}

interface StepSectionProps {
  stepNumber: number;
  title: string;
  description: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  isCompleted?: boolean;
  taskColor?: string;
  taskDescription?: string;
}

const StepSection: React.FC<StepSectionProps> = ({ 
  stepNumber, 
  title, 
  description, 
  children, 
  isOpen, 
  onToggle,
  isCompleted = false,
  taskColor = '#3b82f6',
  taskDescription
}) => (
  <div style={{
    borderBottom: '1px solid rgba(255,255,255,0.06)'
  }}>
    <div 
      style={{
        padding: '40px',
        background: isOpen ? 'var(--surface2)' : 'var(--surface)',
        cursor: 'pointer',
        transition: 'background-color 0.25s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: isOpen ? '1px solid rgba(255,255,255,0.06)' : 'none'
      }}
      onClick={onToggle}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: isCompleted ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : 'linear-gradient(135deg, #2D7EFF 0%, #818cf8 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '700',
          fontSize: '15px',
          boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.1), 0 4px 6px -2px rgba(59, 130, 246, 0.05)'
        }}>
          {isCompleted ? '✓' : stepNumber}
        </div>
        <div>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: 'var(--text-primary)',
            marginBottom: '6px',
            letterSpacing: '-0.3px'
          }}>
            {title}
          </h3>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '15px',
            letterSpacing: '-0.1px',
            margin: 0
          }}>
            {description}
          </p>
        </div>
      </div>
      <div style={{
        color: '#64748b',
        transition: 'transform 0.2s ease',
        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
      }}>
        ▼
      </div>
    </div>
    {isOpen && (
      <div style={{
        display: 'block',
        padding: '40px 40px 0px 40px',
        background: 'var(--surface2)',
        borderTop: '1px solid rgba(255,255,255,0.08)'
      }}>
        {taskDescription && (
          <div style={{
           background: stepNumber === 1 ? 'rgba(59, 130, 246, 0.1)' :
           stepNumber === 2 ? 'rgba(139, 92, 246, 0.1)' :
           stepNumber === 3 ? 'rgba(16, 185, 129, 0.1)' :
           stepNumber === 4 ? 'rgba(245, 158, 11, 0.1)' :
           'rgba(239, 68, 68, 0.1)',
            border: stepNumber === 1 ? '1px solid rgba(59, 130, 246, 0.3)' :
        stepNumber === 2 ? '1px solid rgba(139, 92, 246, 0.3)' :
        stepNumber === 3 ? '1px solid rgba(16, 185, 129, 0.3)' :
        stepNumber === 4 ? '1px solid rgba(245, 158, 11, 0.3)' :
        '1px solid rgba(239, 68, 68, 0.3)',
	    borderRadius: '12px',
            padding: '24px',
            margin: '0px 0px 32px 0px'
          }}>
            <h4 style={{
              color: stepNumber === 1 ? '#3b82f6' :
       stepNumber === 2 ? '#8b5cf6' :
       stepNumber === 3 ? '#10b981' :
       stepNumber === 4 ? '#f59e0b' :
       '#ef4444',
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              🎯 Your Task:
            </h4>
            <p style={{
              color: '#475569',
              fontSize: '15px',
              lineHeight: '1.5',
              margin: 0
            }}>
              {taskDescription}
            </p>
          </div>
        )}
        <div style={{ padding: '0px 0px 40px 0px' }}>
          {children}
        </div>
      </div>
    )}
  </div>
);

const AboutPage: React.FC<{ onBackToPortfolio: () => void }> = ({ onBackToPortfolio }) => (
  <div style={{
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    lineHeight: '1.6',
    color: '#0f172a',
    background: '#ffffff',
    minHeight: '100vh'
  }}>
    {/* Header */}
    <header style={{
      borderBottom: '1px solid #0f172a',
      background: 'rgba(255, 255, 255, 0.98)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      backdropFilter: 'blur(12px)',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '88px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            position: 'relative',
            filter: 'drop-shadow(0 0 15px rgba(7, 12, 22, 0.3))'
          }}>
            {/* Quantum Logo Animation */}
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              background: 'radial-gradient(circle, rgba(7, 12, 22, 0.15) 0%, rgba(71, 85, 105, 0.1) 40%, rgba(100, 116, 139, 0.05) 70%, transparent 100%)',
              borderRadius: '50%',
              animation: 'quantumPulse 4s ease-in-out infinite',
              filter: 'blur(0.5px)'
            }} />
            <style>
              {`
                @keyframes quantumPulse {
                  0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.6; }
                  50% { transform: scale(1.1) rotate(180deg); opacity: 0.9; }
                }
                @keyframes quantumFloat {
                  0%, 100% { transform: translateY(0px) scale(1) rotate(0deg); opacity: 0.9; }
                  33% { transform: translateY(-6px) scale(1.3) rotate(120deg); opacity: 1; }
                  66% { transform: translateY(-3px) scale(0.9) rotate(240deg); opacity: 0.95; }
                }
              `}
            </style>
            {/* Quantum States */}
            {[
              { top: '15%', left: '25%', delay: '0s', size: '3px', color: '#070c16' },
              { top: '35%', left: '75%', delay: '1s', size: '4px', color: '#475569' },
              { top: '65%', left: '15%', delay: '2s', size: '2px', color: '#0c1426' },
              { top: '85%', left: '65%', delay: '3s', size: '5px', color: '#64748b' },
              { top: '25%', left: '85%', delay: '4s', size: '3px', color: '#1e3a8a' },
              { top: '75%', left: '45%', delay: '5s', size: '3px', color: '#374151' },
              { top: '50%', left: '50%', delay: '0s', size: '6px', color: '#ffffff', border: '1px solid rgba(148, 163, 184, 0.4)' }
            ].map((state, index) => (
              <div key={index} style={{
                position: 'absolute',
                top: state.top,
                left: state.left,
                width: state.size,
                height: state.size,
                background: state.color === '#ffffff' ? 'radial-gradient(circle, #ffffff 0%, #070c16 100%)' : state.color,
                borderRadius: '50%',
                animation: `quantumFloat 5s ease-in-out infinite`,
                animationDelay: state.delay,
                filter: 'brightness(1.2) saturate(1.1)',
                boxShadow: `0 0 8px ${state.color}`,
                border: state.border || 'none'
              }} />
            ))}
          </div>
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: 'var(--text-primary)',
            letterSpacing: '-0.5px'
          }}>
            AlphaKnaut V2
          </div>
        </div>
        <nav style={{
          display: 'flex',
          gap: '32px',
          alignItems: 'center'
        }}>
          <button
            onClick={onBackToPortfolio}
            style={{
              color: '#475569',
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '15px',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              padding: '8px 16px',
              borderRadius: '6px',
              background: 'transparent',
              border: 'none'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = '#3b82f6';
              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = '#475569';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Portfolio
          </button>
          <span style={{
            color: '#3b82f6',
            fontWeight: '600',
            fontSize: '15px',
            padding: '8px 16px',
            borderRadius: '6px',
            background: 'rgba(59, 130, 246, 0.1)'
          }}>
            About
          </span>
        </nav>
      </div>
    </header>

    {/* Main Content */}
    <main style={{
      marginTop: '88px',
      maxWidth: '900px',
      marginLeft: 'auto',
      marginRight: 'auto',
      padding: '3rem 2rem'
    }}>
      <h1 style={{
        fontSize: '3rem',
        fontWeight: '800',
        lineHeight: '1.1',
        color: '#0f172a',
        marginBottom: '0.5rem',
        letterSpacing: '-1px',
        background: 'linear-gradient(135deg, #0f172a 0%, #3b82f6 70%, #8b5cf6 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        AlphaKnaut V2: Building Institutional-Grade AI for Portfolio Strategy
      </h1>
      <p style={{
        fontSize: '1.25rem',
        color: '#64748b',
        fontStyle: 'italic',
        marginBottom: '3rem',
        fontWeight: '500'
      }}>
        A Self-Directed Project at the Intersection of Finance, Economics & AI
      </p>

      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{
          fontSize: '1.75rem',
          fontWeight: '700',
          color: '#0f172a',
          marginBottom: '1rem',
          letterSpacing: '-0.3px'
        }}>
          The Challenge
        </h2>
        <div style={{
          color: '#475569',
          fontSize: '1rem',
          lineHeight: '1.7'
        }}>
         <p style={{ marginBottom: '1rem' }}>
  In Summer 2025, I (<a 
    href="https://www.linkedin.com/in/riya-pradhan/" 
    target="_blank" 
    rel="noopener noreferrer"
    style={{
      color: '#1e3a8a',
      textDecoration: 'none',
      fontWeight: '600',
      borderBottom: '1px solid transparent',
      transition: 'all 0.2s ease'
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.borderBottom = '1px solid #1e3a8a';
      e.currentTarget.style.color = '#1e40af';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.borderBottom = '1px solid transparent';
      e.currentTarget.style.color = '#1e3a8a';
    }}
  >
    Riya Pradhan
  </a>) set out to find internships combining <strong style={{ color: '#0f172a', fontWeight: '600' }}>financial economics and AI</strong>—the intersection where I plan to build my career. But such opportunities didn't exist. So I built one myself.
</p>
          <p style={{ marginBottom: '1rem' }}>
            Could I create an AI-powered investment platform with no prior programming experience in six weeks?
          </p>
          <p style={{ marginBottom: '1rem' }}>
            <strong style={{ color: '#0f172a', fontWeight: '600' }}>The result:</strong> AlphaKnaut—a full-stack platform that integrates real-time financial data, economic modeling, and AI reasoning for portfolio optimization.
          </p>
        </div>
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{
          fontSize: '1.75rem',
          fontWeight: '700',
          color: '#0f172a',
          marginBottom: '1rem',
          letterSpacing: '-0.3px'
        }}>
          What AlphaKnaut Is
        </h2>
        <div style={{
          color: '#475569',
          fontSize: '1rem',
          lineHeight: '1.7'
        }}>
          <p style={{ marginBottom: '1rem' }}>
            AlphaKnaut is an AI-powered portfolio optimization platform centered on the Magnificent 7 technology stocks ($17.4 trillion market cap, 34% of S&P 500 weight). The platform combines real-time financial data, macroeconomic indicators, news sentiment, and AI-powered reasoning to generate forward-looking portfolio insights.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            The system simulates institutional-grade financial analysis through responsive data visualizations, economic forecasting, and natural language processing that adjusts to user preferences and market conditions.
          </p>
        </div>
      </div>

<div style={{ marginBottom: '3rem' }}>
        <h2 style={{
          fontSize: '1.75rem',
          fontWeight: '700',
          color: '#0f172a',
          marginBottom: '1rem',
          letterSpacing: '-0.3px'
        }}>
          Why "AlphaKnaut"?
        </h2>
        <div style={{
          color: '#475569',
          fontSize: '1rem',
          lineHeight: '1.7'
        }}>
          <p style={{ marginBottom: '1rem' }}>
            <strong style={{ color: '#0f172a', fontWeight: '600' }}>"Alpha"</strong> represents excess returns above market benchmarks—the ultimate goal of sophisticated investing. In institutional finance, consistently generating alpha requires advanced quantitative analysis, precision risk management, and superior market intelligence.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            <strong style={{ color: '#0f172a', fontWeight: '600' }}>"Knaut"</strong> (navigator/explorer) embodies the systematic journey toward discovering optimal portfolio allocations. Just as astronauts navigate uncharted space using cutting-edge technology, AlphaKnaut navigates the complex intersection of AI and financial markets to guide investors toward alpha-generating portfolios.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            <strong style={{ color: '#0f172a', fontWeight: '600' }}>AlphaKnaut's Mission:</strong> To be the intelligent navigator that helps investors reach optimal portfolio construction, systematically beating market benchmarks through AI-powered analysis and institutional-grade methodology.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            <strong style={{ color: '#0f172a', fontWeight: '600' }}>Important Distinction:</strong> AlphaKnaut is entirely separate from Alphanaut.io (the cryptocurrency trading platform). While they focus on crypto trading automation, AlphaKnaut specializes exclusively in AI-driven equity portfolio optimization and fundamental analysis of technology sector leaders.
          </p>
        </div>
      </div>

	
	{/* ADD THIS NEW SECTION HERE */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{
          fontSize: '1.75rem',
          fontWeight: '700',
          color: '#0f172a',
          marginBottom: '1rem',
          letterSpacing: '-0.3px'
        }}>
          AI Reliability Challenges
        </h2>
        <div style={{
          color: '#475569',
          fontSize: '1rem',
          lineHeight: '1.7'
        }}>
          <p style={{ marginBottom: '1rem' }}>
            <strong style={{ color: '#0f172a', fontWeight: '600' }}>The Hallucination Problem:</strong> As an LLM-powered system, Claude can generate convincing but inaccurate information—from unrealistic inflation rates (320%+) to political timeline confusion (mixing Biden/Trump references). Since these models are non-deterministic and stochastic by nature, the same input can produce different outputs, making reliability challenges even more complex.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            <strong style={{ color: '#0f172a', fontWeight: '600' }}>Solutions Implemented:</strong> I developed validation layers including economic data sanity checks, temporal consistency filters, and response verification algorithms. These significantly reduced hallucination frequency, but complete elimination proved impossible.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            <strong style={{ color: '#0f172a', fontWeight: '600' }}>Key Learning:</strong> The challenge isn't perfecting AI output, but building robust systems that assume AI will make mistakes. Each validation layer taught me more about practical AI deployment than theoretical coursework ever could.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            <strong style={{ color: '#0f172a', fontWeight: '600' }}>Looking Forward:</strong> The remaining edge cases are fascinating—they reveal how LLMs process and sometimes misconnect information. This real-world debugging experience highlighted the critical gap between AI research and production deployment.
          </p>
        </div>
      </div>

{/* V2 as completely separate "NEW" section */}
<div style={{
  background: 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)',
  padding: '3rem 2rem',
  borderRadius: '16px',
  margin: '3rem 0',
  position: 'relative',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
}}>
  {/* "NEW" badge */}
  <div style={{
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: '#10b981',
    color: '#ffffff',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '1px'
  }}>
    NEW - SEPTEMBER 2025
  </div>
  <h2 style={{
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '1rem',
    letterSpacing: '-0.3px'
  }}>
    AlphaKnaut V2: Advanced Risk Analytics Engine
  </h2>
  
  <div style={{
    color: '#0f172a',
    fontSize: '1rem',
    lineHeight: '1.7'
  }}>
    <p style={{ marginBottom: '1rem' }}>
      <strong style={{ color: '#0f172a', fontWeight: '600' }}>The Next Evolution:</strong> Following the initial platform completion in Summer 2025, I spent September 2025 addressing this gap. Traditional portfolio tools provide basic risk scores, but institutional investors demand precise probability distributions and tail risk analysis. This drove the development of V2's comprehensive Monte Carlo simulation engine.
    </p>
    
    <p style={{ marginBottom: '1rem' }}>
      <strong style={{ color: '#0f172a', fontWeight: '600' }}>Institutional-Grade Risk Modeling:</strong> V2 introduces quantitative risk analytics that mirror those used by hedge funds and institutional asset managers. The Monte Carlo engine runs 10,000 probabilistic simulations, each representing a possible future market scenario based on 7 years of historical return patterns. This captures critical market events that shape risk profiles: the 2018 volatility spike, 2020's unprecedented crash and recovery, and the 2022-2023 interest rate regime shift.
    </p>
    
    <p style={{ marginBottom: '1rem' }}>
      <strong style={{ color: '#0f172a', fontWeight: '600' }}>Beyond Basic Risk Assessment:</strong> The system calculates Value-at-Risk (VaR) at both 95% and 99% confidence levels—the industry standard for regulatory capital requirements and internal risk limits. But V2 goes further, implementing Expected Shortfall analysis that quantifies average losses when VaR thresholds are breached. This addresses VaR's critical limitation: it reveals the probability of extreme losses but not their magnitude.
    </p>
    
    <p style={{ marginBottom: '1rem' }}>
      <strong style={{ color: '#0f172a', fontWeight: '600' }}>The Data Science Challenge:</strong> Implementing robust Monte Carlo simulation required solving several technical problems. The engine must dynamically calculate correlation matrices between assets, model multivariate return distributions, and simulate thousands of daily price paths while maintaining computational efficiency. The transition from 2-year to 7-year historical datasets proved crucial—initial results showed unrealistically optimistic risk estimates (7.8% probability of loss) that ignored major market disruptions.
    </p>
    
   <p style={{ marginBottom: '1rem' }}>
  <strong style={{ color: '#0f172a', fontWeight: '600' }}>Real Risk, Real Numbers:</strong> V2's enhanced modeling reveals more realistic risk profiles. Portfolio probability of loss estimates increased to the 15-25% range, and maximum drawdown projections expanded from 30% to 40-50%—figures that align with actual technology portfolio performance during market stress. This demonstrates how sample size and historical coverage directly impact quantitative model reliability. V2 transforms AlphaKnaut from a portfolio construction tool into a comprehensive risk management platform. Users can now quantify the statistical likelihood of various outcomes, understand correlation breakdowns during stress periods, and make informed decisions about position sizing and portfolio concentration. This bridges the gap between academic portfolio theory and practical risk management—the intersection where institutional finance operates.
</p>

<p style={{ marginBottom: '0' }}>
  The development of V2's risk engine reinforced my conviction that the future lies in systems that don't just optimize for returns, but quantify and communicate the uncertainties inherent in those projections. This is the foundation of institutional decision-making.
</p>
  </div>
</div>

      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{
          fontSize: '1.75rem',
          fontWeight: '700',
          color: '#0f172a',
          marginBottom: '1rem',
          letterSpacing: '-0.3px'
        }}>
          Technical Architecture
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          margin: '1.5rem 0'
        }}>
          {[
            {
              title: 'Frontend: React.js + TypeScript',
              desc: 'Custom component architecture with 15+ interconnected state variables, Recharts integration, mobile-first responsive design'
            },
            {
              title: 'Backend: Python Flask API',
              desc: '12 RESTful endpoints, multi-threaded architecture, robust error handling with fallback mechanisms'
            },
            {
              title: 'AI Integration: Anthropic Claude',
              desc: 'Custom prompt engineering, structured JSON outputs, adaptive prompts based on market conditions'
            },
            {
              title: 'Data Pipeline',
              desc: '4 external APIs: Yahoo Finance, Federal Reserve FRED, NewsAPI, Finnhub for comprehensive market intelligence'
            }
          ].map((item, index) => (
            <div key={index} style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '1rem',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.2)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(59, 130, 246, 0.1), 0 4px 6px -2px rgba(59, 130, 246, 0.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <h4 style={{
                color: '#3b82f6',
                fontSize: '0.9rem',
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}>
                {item.title}
              </h4>
              <p style={{
                color: '#64748b',
                fontSize: '0.85rem',
                margin: 0
              }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          margin: '1.5rem 0',
          background: '#ffffff',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <thead>
            <tr>
              <th style={{
                background: '#f1f5f9',
                color: '#374151',
                fontWeight: '600',
                padding: '0.75rem',
                textAlign: 'left',
                fontSize: '0.9rem'
              }}>Source</th>
              <th style={{
                background: '#f1f5f9',
                color: '#374151',
                fontWeight: '600',
                padding: '0.75rem',
                textAlign: 'left',
                fontSize: '0.9rem'
              }}>Purpose</th>
              <th style={{
                background: '#f1f5f9',
                color: '#374151',
                fontWeight: '600',
                padding: '0.75rem',
                textAlign: 'left',
                fontSize: '0.9rem'
              }}>Integration</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Yahoo Finance', 'Stock prices & changes', 'Real-time price feeds → Portfolio calculations'],
              ['Federal Reserve FRED', 'Economic indicators', 'Macro data → AI context building'],
              ['NewsAPI', 'Market headlines', 'Event filtering → Investment implications'],
              ['Finnhub', 'Company sentiment', 'News analysis → Risk assessment']
            ].map((row, index) => (
              <tr key={index}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} style={{
                    padding: '0.75rem',
                    borderTop: '1px solid #e5e7eb',
                    color: '#4b5563',
                    fontSize: '0.9rem'
                  }}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{
          fontSize: '1.75rem',
          fontWeight: '700',
          color: '#0f172a',
          marginBottom: '1rem',
          letterSpacing: '-0.3px'
        }}>
          The Development Process: 6 Weeks
        </h2>
        <div style={{
          borderLeft: '2px solid #e2e8f0',
          paddingLeft: '1.5rem',
          margin: '1.5rem 0'
        }}>
          {[
            {
              title: 'Weeks 1-2: Foundation',
              content: 'Learned TypeScript, React, and Python simultaneously. Mastered state management and API integration. Built development environment and Git workflow.'
            },
            {
              title: 'Week 3: Data Integration',
              content: 'Created pipelines for 4 external APIs with asynchronous processing. Implemented error handling for rate limits and service failures.'
            },
            {
              title: 'Week 4: AI Implementation',
              content: 'Engineered prompts for market-aware financial analysis. Built unified AI engine for portfolio and benchmark analysis.'
            },
            {
              title: 'Weeks 5-6: Features & Polish',
              content: 'Implemented 3 allocation strategies with risk monitoring. Created weight normalization algorithms. Designed professional UI through multiple iterations.'
            }
          ].map((item, index) => (
            <div key={index} style={{
              marginBottom: '1.5rem',
              position: 'relative'
            }}>
              <div style={{
                content: '',
                position: 'absolute',
                left: '-1.65rem',
                top: '0.25rem',
                width: '10px',
                height: '10px',
                background: '#3b82f6',
                borderRadius: '50%'
              }}></div>
              <div style={{
                fontWeight: '600',
                color: '#0f172a',
                marginBottom: '0.25rem'
              }}>
                {item.title}
              </div>
              <div style={{
                color: '#64748b',
                fontSize: '0.9rem'
              }}>
                {item.content}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{
          fontSize: '1.75rem',
          fontWeight: '700',
          color: '#0f172a',
          marginBottom: '1rem',
          letterSpacing: '-0.3px'
        }}>
          Key Technical Innovations
        </h2>
        {[
          {
            title: 'Unified AI Methodology',
            content: 'Most platforms use different calculation methods for portfolio analysis versus benchmark comparisons. AlphaKnaut uses a single AI reasoning engine for both, ensuring consistent logic and comparable results across all analysis.'
          },
          {
            title: 'Smart Weight Normalization',
            content: 'Built custom algorithm that maintains user preferences while auto-adjusting remaining positions to ensure 100% allocation:'
          },
          {
            title: 'Real-Time Market Intelligence',
            content: 'Processes 50+ news headlines per analysis cycle. Claude AI filters for market-relevant events. Integrates findings into specific portfolio predictions with quantified impacts.'
          }
        ].map((item, index) => (
          <div key={index} style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '1.5rem',
            margin: '1.5rem 0',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
          }}>
            <h3 style={{
              color: '#3b82f6',
              marginBottom: '1rem'
            }}>
              {item.title}
            </h3>
            <p>{item.content}</p>
            {index === 1 && (
              <div style={{
                background: '#1e293b',
                color: '#e2e8f0',
                padding: '1rem',
                borderRadius: '8px',
                fontFamily: "'Monaco', 'Menlo', monospace",
                fontSize: '0.85rem',
                overflow: 'auto',
                margin: '1rem 0'
              }}>
{`const updateCustomWeight = (stock: string, newWeight: number) => {
    // Preserve user-set allocations
    // Auto-adjust non-fixed positions proportionally
    // Maintain mathematical consistency
}`}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{
          fontSize: '1.75rem',
          fontWeight: '700',
          color: '#0f172a',
          marginBottom: '1rem',
          letterSpacing: '-0.3px'
        }}>
          Three Strategic Frameworks
        </h2>
        {[
          {
            title: '🔵 Strategy 1: Equal Weight Distribution',
            content: 'Systematic diversification with automatic rebalancing across selected assets for maximum diversification benefit.'
          },
          {
            title: '🟡 Strategy 2: Custom Allocation + AI Risk Monitoring',
            content: 'Manual slider controls with AI-powered concentration risk detection. System triggers warnings at >25% allocations and suggests alternatives including ETFs and rebalancing strategies.'
          },
          {
            title: '🔴 Strategy 3: AI Portfolio Manager',
            content: 'Claude acts as institutional portfolio manager, analyzing fundamentals, market conditions, and risk factors to recommend optimal allocations or alternative investments entirely.'
          }
        ].map((item, index) => (
          <div key={index} style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '1.5rem',
            margin: '1rem 0',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.2)';
            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(59, 130, 246, 0.1), 0 4px 6px -2px rgba(59, 130, 246, 0.05)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            <div style={{
              color: '#0f172a',
              fontWeight: '600',
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              {item.title}
            </div>
            <p>{item.content}</p>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{
          fontSize: '1.75rem',
          fontWeight: '700',
          color: '#0f172a',
          marginBottom: '1rem',
          letterSpacing: '-0.3px'
        }}>
          Why This Matters
        </h2>
        <div style={{
          color: '#475569',
          fontSize: '1rem',
          lineHeight: '1.7'
        }}>
          <p style={{ marginBottom: '1rem' }}>
            Building AlphaKnaut deepened my understanding of where my true passion lies—at the intersection of AI, finance, and economic reasoning. This project crystallized my career direction and showed me that the most compelling problems exist where disciplines converge.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            The technical challenges taught me invaluable lessons: translating economic theory into AI prompts, converting market sentiment into quantifiable risk metrics, and building systems that think like institutional analysts. This is precisely where I want to focus my career—constantly adapting my skills as these fields evolve together.
          </p>
          <p style={{ marginBottom: '1rem' }}>
  <strong style={{ color: '#0f172a', fontWeight: '600' }}>Next steps:</strong> My next project will be a profitable venture, applying these same principles of financial AI to real market opportunities.
</p>
<p style={{ marginBottom: '1rem' }}>
  I'd love to connect and chat about this project or anything related to finance and AI! Feel free to reach out on LinkedIn.
</p>
        </div>
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{
          fontSize: '1.75rem',
          fontWeight: '700',
          color: '#0f172a',
          marginBottom: '1rem',
          letterSpacing: '-0.3px'
        }}>
          What This Demonstrates
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          margin: '1.5rem 0'
        }}>
          {[
            {
              title: 'Technical Implementation',
              desc: 'Full-stack development from zero programming knowledge to functional platform with complex AI integration'
            },
            {
              title: 'Financial Technology Innovation',
              desc: 'Portfolio theory application with modern risk management constraints and institutional methodology'
            },
            {
              title: 'Problem-Solving Approach',
              desc: 'Self-directed learning across multiple technical domains with innovation under time constraints'
            },
            {
              title: 'Applied Knowledge',
              desc: 'Bridging theoretical understanding with hands-on application of economics and finance principles'
            }
          ].map((item, index) => (
            <div key={index} style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              <h4 style={{
                color: '#3b82f6',
                fontSize: '0.9rem',
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}>
                {item.title}
              </h4>
              <p style={{
                color: '#64748b',
                fontSize: '0.85rem',
                margin: 0
              }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        textAlign: 'center',
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '1.5rem',
        margin: '1.5rem 0'
      }}>
        <h3 style={{ marginBottom: '1rem' }}>Technical Specifications</h3>
        <p><strong>Frontend:</strong> React.js, TypeScript, Recharts | <strong>Backend:</strong> Python Flask with RESTful API design</p>
        <p><strong>AI:</strong> Anthropic Claude with custom prompt engineering | <strong>Data:</strong> Yahoo Finance, Federal Reserve FRED, NewsAPI, Finnhub</p>
        <p><strong>Timeline:</strong> 6 weeks of focused development</p>
      </div>

      {/* Contact Section */}
      <div style={{
        background: '#0f172a',
        color: 'white',
        padding: '2rem',
        borderRadius: '12px',
        textAlign: 'center',
        marginTop: '3rem'
      }}>
        <div style={{
          fontSize: '1.25rem',
          fontWeight: '700',
          marginBottom: '0.5rem'
        }}>
          Riya Pradhan
        </div>
        <div style={{
          color: '#94a3b8',
          marginBottom: '1rem'
        }}>
          University of Toronto | Financial Economics & FinTech
        </div>
        <a 
          href="https://www.linkedin.com/in/riya-pradhan" 
          style={{
            color: '#60a5fa',
            textDecoration: 'none'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = '#93c5fd';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = '#60a5fa';
          }}
        >
          LinkedIn: linkedin.com/in/riya-pradhan
        </a>
      </div>
    </main>
  </div>
);

const Portfolio: React.FC = () => {
  // All existing state variables - UNCHANGED
  const [stockData, setStockData] = useState<{[key: string]: StockData}>({});
  const [selectedStocks, setSelectedStocks] = useState<string[]>(['AAPL', 'MSFT', 'GOOGL']);
  const [riskProfile, setRiskProfile] = useState<string>('moderate');
  const [aiRecommendation, setAiRecommendation] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [investmentAmount, setInvestmentAmount] = useState<number>(100000);
  
  // Economic Intelligence state variables
  const [economicData, setEconomicData] = useState<any>(null);
  const [economicLoading, setEconomicLoading] = useState<boolean>(false);
  const [enhancedPredictions, setEnhancedPredictions] = useState<any>(null);
  
  // Market News state variables
  const [marketNews, setMarketNews] = useState<any>(null);
  const [newsLoading, setNewsLoading] = useState<boolean>(false);

  // Smart slider state variables
  const [customWeights, setCustomWeights] = useState<{[key: string]: number}>({});
  const [aiOptimization, setAiOptimization] = useState<any>(null);
  const [userSetStocks, setUserSetStocks] = useState<Set<string>>(new Set());
  const [selectedTimeframe, setSelectedTimeframe] = useState<number>(3);

  // Strategy 3 state variables
  const [aiPortfolioResult, setAiPortfolioResult] = useState<any>(null);
  const [aiPortfolioLoading, setAiPortfolioLoading] = useState<boolean>(false);

  // Enhanced 7-benchmark comparison state variables
  const [benchmarkData, setBenchmarkData] = useState<any>(null);
  const [benchmarkLoading, setBenchmarkLoading] = useState<boolean>(false);

  const [monteCarloResults, setMonteCarloResults] = useState<any>(null);
  const [monteCarloLoading, setMonteCarloLoading] = useState<boolean>(false);

  // Step visibility state
  const [openSteps, setOpenSteps] = useState<{[key: number]: boolean}>({
    1: true,
    2: false,
    3: false,
    4: false,
    5: false
  });

  // Strategy selection state
  const [selectedStrategy, setSelectedStrategy] = useState<number>(1);

  // NEW: About page state
  const [showAboutPage, setShowAboutPage] = useState<boolean>(false);

  const magnificent7 = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NVDA', 'TSLA'];

  // CSS Variables - v3 Dark Design
  const cssVars = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=IBM+Plex+Mono:wght@300;400;500&display=swap');

    :root {
      --bg:        #080E1A;
      --bg2:       #0B1220;
      --surface:   #0F1828;
      --surface2:  #131E2E;
      --line:      rgba(255,255,255,0.06);
      --line2:     rgba(255,255,255,0.10);
      --line3:     rgba(255,255,255,0.16);

      --accent:        #2D7EFF;
      --accent-light:  #5A9FFF;
      --accent-dim:    rgba(45,126,255,0.10);
      --accent-purple: #818cf8;
      --accent-emerald:#22c55e;
      --accent-rose:   #f43f5e;

      --text-primary:   #F4F7FF;
      --text-secondary: #B8C4D8;
      --text-muted:     #6B7A94;
      --text-faint:     #3A4558;

      --success: #22C55E;
      --warning: #F59E0B;
      --error:   #EF4444;

      --surface-elevated: #131E2E;
      --surface-hover:    #1a2640;
      --surface-accent:   rgba(45,126,255,0.06);
      --surface-purple:   rgba(129,140,248,0.06);
      --surface-emerald:  rgba(34,197,94,0.06);
      --border:           rgba(255,255,255,0.08);
      --border-light:     rgba(255,255,255,0.05);
      --border-accent:    rgba(45,126,255,0.25);

      --gradient-primary: linear-gradient(135deg, #2D7EFF 0%, #818cf8 100%);
      --gradient-success: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      --gradient-warm:    linear-gradient(135deg, #f59e0b 0%, #f97316 100%);

      --shadow-sm:     0 1px 2px 0 rgba(0,0,0,0.3);
      --shadow-md:     0 4px 6px -1px rgba(0,0,0,0.4), 0 2px 4px -1px rgba(0,0,0,0.2);
      --shadow-lg:     0 10px 15px -3px rgba(0,0,0,0.4), 0 4px 6px -2px rgba(0,0,0,0.2);
      --shadow-xl:     0 20px 25px -5px rgba(0,0,0,0.5), 0 10px 10px -5px rgba(0,0,0,0.2);
      --shadow-accent: 0 10px 15px -3px rgba(45,126,255,0.15), 0 4px 6px -2px rgba(45,126,255,0.08);
    }

    * { box-sizing: border-box; }

    html, body {
      margin: 0; padding: 0;
      overflow-x: hidden;
      background: #080E1A;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
      color: #F4F7FF;
    }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: #080E1A; }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 2px; }

    /* Recharts overrides for dark mode */
    .recharts-cartesian-grid-horizontal line,
    .recharts-cartesian-grid-vertical line {
      stroke: rgba(255,255,255,0.06) !important;
    }
    .recharts-tooltip-wrapper .recharts-default-tooltip {
      background: #131E2E !important;
      border: 1px solid rgba(255,255,255,0.10) !important;
      color: #F4F7FF !important;
    }
    .recharts-legend-item-text { color: #B8C4D8 !important; }
    .recharts-text { fill: #6B7A94 !important; }

    /* Header mobile */
    @media (max-width: 768px) {
      header > div { padding: 0 16px !important; height: 64px !important; }
      header > div > div:first-child { gap: 10px !important; }
      header > div > div:first-child > div:last-child { font-size: 17px !important; }
    }

    /* Hero mobile */
    @media (max-width: 768px) {
      section[style*="padding: 120px"] {
        padding: 70px 16px 50px !important;
        margin-top: 64px !important;
      }
      h1[style*="fontSize: '80px'"] {
        font-size: 40px !important;
        line-height: 1.1 !important;
        letter-spacing: -1px !important;
      }
    }

    /* Grid mobile */
    @media (max-width: 640px) {
      div[style*="gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'"],
      div[style*="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr))"] {
        grid-template-columns: 1fr !important;
      }
      div[style*="padding: 40px"] { padding: 20px 16px !important; }
    }

    /* Text wrapping */
    h1, h2, h3, p, div { word-wrap: break-word; overflow-wrap: break-word; hyphens: auto; }

    /* Button mobile */
    @media (max-width: 480px) {
      button { min-width: auto !important; width: 100% !important; max-width: 100% !important; }
    }

    /* Progress indicator mobile */
    @media (max-width: 768px) {
      div[style*="margin: '64px 0'"] {
        margin: 32px 16px !important;
        overflow-x: auto !important;
      }
      div[style*="width: '60px'"][style*="height: '2px'"] { min-width: 32px !important; }
    }

    /* Mobile notice */
    .mobile-notice {
      display: none;
      position: fixed; bottom: 20px; left: 20px; right: 20px;
      background: rgba(8,14,26,0.96);
      color: #B8C4D8;
      padding: 14px 16px;
      border-radius: 8px;
      border: 1px solid rgba(255,255,255,0.10);
      font-size: 13px; text-align: center;
      z-index: 9999;
      backdrop-filter: blur(12px);
    }
    @media (max-width: 768px) { .mobile-notice { display: block; } }

    /* Dropdown arrow */
    @media (max-width: 768px) {
      div[style*="transform: rotate(180deg)"],
      div[style*="transform: rotate(0deg)"] {
        min-width: 20px !important; width: 20px !important; height: 20px !important;
        display: flex !important; align-items: center !important;
        justify-content: center !important; flex-shrink: 0 !important;
      }
    }
  `;

  // All existing useEffect hooks and functions - UNCHANGED
  useEffect(() => {
    if (enhancedPredictions) {
      setEnhancedPredictions(null);
    }
    if (aiPortfolioResult) {
      setAiPortfolioResult(null);
    }
    if (benchmarkData) {
      setBenchmarkData(null);
    }
  }, [selectedStocks, riskProfile, selectedStrategy, investmentAmount, selectedTimeframe, customWeights]);

  useEffect(() => {
    fetchStockData();
    getEconomicIntelligence();
  }, []);

  useEffect(() => {
    if (selectedStocks.length > 0) {
      const equalWeight = 1 / selectedStocks.length;
      const initialWeights: {[key: string]: number} = {};
      selectedStocks.forEach(stock => {
        initialWeights[stock] = equalWeight;
      });
      setCustomWeights(initialWeights);
      setUserSetStocks(new Set());
    }
  }, [selectedStocks]);

// ADD THIS NEW useEffect HERE:
useEffect(() => {
  const handleResize = () => {
    // Force re-render on window resize for responsive styles
    setShowAboutPage(prev => prev);
  };

  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

 const fetchStockData = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:5000/api/stocks/magnificent7');
    setStockData(response.data.data);
  } catch (error) {
    console.error('Error fetching stock data:', error);
  }
};

  const getEconomicIntelligence = async () => {
  setEconomicLoading(true);
  try {
    const response = await axios.get('http://127.0.0.1:5000/api/market/economic-intelligence');
    setEconomicData(response.data);
  } catch (error) {
    console.error('Error fetching economic intelligence:', error);
  }
  setEconomicLoading(false);
};

  // All existing functions - UNCHANGED
  const getCurrentPortfolioWeights = () => {
    if (selectedStrategy === 1) {
      const equalWeight = 1 / selectedStocks.length;
      const weights: {[key: string]: number} = {};
      selectedStocks.forEach(stock => {
        weights[stock] = equalWeight;
      });
      return weights;
    } else if (selectedStrategy === 2) {
      return customWeights;
    } else if (selectedStrategy === 3 && aiPortfolioResult?.ai_optimization?.recommended_allocations) {
      return aiPortfolioResult.ai_optimization.recommended_allocations;
    }
    return {};
  };

  const getEnhancedPredictions = async () => {
    const weightsToUse = getCurrentPortfolioWeights();

    if (Object.keys(weightsToUse).length === 0) {
      alert('Please set your portfolio allocation first!');
      return;
    }
    
    setEconomicLoading(true);
    try {
      console.log('🔮 Getting NEWS-ENHANCED predictions with weights:', weightsToUse);
      
      const response = await axios.post('http://127.0.0.1:5000/api/portfolio/enhanced-predictions-fixed', {
  weights: weightsToUse,
  risk_profile: riskProfile,
  amount: investmentAmount,
  selected_years: selectedTimeframe
});
      
      console.log('✅ FIXED: Enhanced predictions received:', response.data);
      console.log('✅ Enhanced predictions structure:', response.data.enhanced_predictions);
      setEnhancedPredictions(response.data);
      
    } catch (error) {
      console.error('❌ Error getting news-enhanced predictions:', error);
      alert('Unable to get predictions. Please check your backend connection.');
    }
    setEconomicLoading(false);
  };

  const getAIPortfolioOptimization = async () => {
    if (selectedStocks.length === 0) {
      alert('Please select some stocks first!');
      return;
    }
    
    setAiPortfolioLoading(true);
    try {
      console.log('🤖 Getting AI Portfolio Optimization...');
      
      const response = await axios.post('http://127.0.0.1:5000/api/portfolio/ai-optimize', {
        stocks: selectedStocks,
        risk_profile: riskProfile,
        amount: investmentAmount
      });
      
      console.log('✅ AI Portfolio Optimization received:', response.data);
      setAiPortfolioResult(response.data);
      
    } catch (error) {
      console.error('❌ Error getting AI portfolio optimization:', error);
      alert('Unable to get AI optimization. Please check your backend connection.');
    }
    setAiPortfolioLoading(false);
  };

  const getBenchmarkComparison = async () => {
    const weightsToUse = getCurrentPortfolioWeights();

    if (Object.keys(weightsToUse).length === 0) {
      if (selectedStrategy === 3) {
        alert('Please generate AI optimization first!');
      } else {
        alert('Please set your portfolio allocation first!');
      }
      return;
    }
    
    setBenchmarkLoading(true);
    try {
      console.log('📊 Getting AI-enhanced 7-benchmark comparison with weights:', weightsToUse);
      
  const response = await axios.post('http://127.0.0.1:5000/api/portfolio/benchmark-comparison-fixed', {
  weights: weightsToUse,
  amount: investmentAmount,
  years: selectedTimeframe,
  risk_profile: riskProfile,
  existing_analysis: enhancedPredictions?.enhanced_predictions  // ADD THIS LINE
});
      
      console.log('✅ FIXED: Benchmark comparison received:', response.data);
      console.log('✅ Benchmark data structure:', response.data.comparison_data);
      setBenchmarkData(response.data.comparison_data);
      
    } catch (error) {
      console.error('❌ Error getting 7-benchmark comparison:', error);
      alert('Unable to generate comparison. Please check your backend connection.');
    }
    setBenchmarkLoading(false);
  };

  const getMarketIntelligence = async () => {
    if (selectedStocks.length === 0) {
      alert('Please select some stocks first!');
      return;
    }
    
    setNewsLoading(true);
    try {
      console.log('🔍 Fetching market intelligence for:', selectedStocks);
      
    const response = await axios.post('http://127.0.0.1:5000/api/market/news-sentiment', {
        stocks: selectedStocks
      });
      
      console.log('✅ Market intelligence received:', response.data);
      setMarketNews(response.data);
      
    } catch (error) {
      console.error('❌ Error fetching market intelligence:', error);
      alert('Error fetching market news. Please check your backend connection.');
    }
    setNewsLoading(false);
  };

  // All other existing functions - UNCHANGED
  const updateCustomWeight = (stock: string, newWeight: number) => {
    const updatedWeights = { ...customWeights };
    const updatedUserSetStocks = new Set(userSetStocks);
    
    updatedUserSetStocks.add(stock);
    updatedWeights[stock] = newWeight;
    
    const autoAdjustStocks = selectedStocks.filter(s => !updatedUserSetStocks.has(s));
    const userSetTotal = selectedStocks
      .filter(s => updatedUserSetStocks.has(s))
      .reduce((sum, s) => sum + updatedWeights[s], 0);
    
    const remainingWeight = Math.max(0, 1 - userSetTotal);
    
    if (autoAdjustStocks.length > 0) {
      if (remainingWeight <= 0) {
        autoAdjustStocks.forEach(s => updatedWeights[s] = 0);
      } else {
        const currentAutoTotal = autoAdjustStocks.reduce((sum, s) => sum + (updatedWeights[s] || 0), 0);
        
        if (currentAutoTotal > 0) {
          autoAdjustStocks.forEach(s => {
            const currentWeight = updatedWeights[s] || 0;
            updatedWeights[s] = (currentWeight / currentAutoTotal) * remainingWeight;
          });
        } else {
          const equalWeight = remainingWeight / autoAdjustStocks.length;
          autoAdjustStocks.forEach(s => updatedWeights[s] = equalWeight);
        }
      }
    }
    
    setCustomWeights(updatedWeights);
    setUserSetStocks(updatedUserSetStocks);
  };

  const resetWeights = () => {
    if (selectedStocks.length > 0) {
      const equalWeight = 1 / selectedStocks.length;
      const resetWeights: {[key: string]: number} = {};
      selectedStocks.forEach(stock => {
        resetWeights[stock] = equalWeight;
      });
      setCustomWeights(resetWeights);
      setUserSetStocks(new Set());
    }
  };

  const getAIOptimization = async () => {
    if (Object.keys(customWeights).length === 0) return;
    
    try {
      console.log('🔍 Getting AI alternatives for Strategy 2...');
      
     const response = await axios.post('http://127.0.0.1:5000/api/portfolio/analyze', {
        weights: customWeights,
        risk_profile: riskProfile,
        amount: investmentAmount
      });
      
      console.log('✅ AI alternatives received:', response.data);
      setAiOptimization(response.data);
      
    } catch (error) {
      console.error('Error getting AI optimization:', error);
    }
  };

const getMonteCarloAnalysis = async () => {
  const weightsToUse = getCurrentPortfolioWeights();

  if (Object.keys(weightsToUse).length === 0) {
    alert('Please set your portfolio allocation first!');
    return;
  }
  
  setMonteCarloLoading(true);
  try {
    console.log('🎲 Running Monte Carlo analysis...');
    
    const response = await axios.post('http://127.0.0.1:5000/api/portfolio/monte-carlo-analysis', {
      weights: weightsToUse,
      amount: investmentAmount,
      years: selectedTimeframe,
      simulations: 10000
    });
    
    console.log('✅ Monte Carlo results:', response.data);
    setMonteCarloResults(response.data);
    
  } catch (error) {
    console.error('❌ Monte Carlo error:', error);
    alert('Unable to run Monte Carlo simulation. Please check your backend connection.');
  }
  setMonteCarloLoading(false);
};

  const toggleStep = (stepNumber: number) => {
    setOpenSteps(prev => {
      // Close all steps first
      const newState = Object.keys(prev).reduce((acc, key) => {
        acc[parseInt(key)] = false;
        return acc;
      }, {} as {[key: number]: boolean});
      
      // Open the clicked step
      newState[stepNumber] = !prev[stepNumber];
      return newState;
    });
  };

  const selectStrategy = (strategyNum: number) => {
    setSelectedStrategy(strategyNum);
    setEnhancedPredictions(null);
    setAiPortfolioResult(null);
    setAiOptimization(null);
    setBenchmarkData(null);
  };

  const selectQuickAmount = (amount: number) => {
    setInvestmentAmount(amount);
  };

  const shouldShowAlternatives = () => {
    const maxWeight = Math.max(...Object.values(customWeights));
    return selectedStrategy === 2 && maxWeight > 0.25;
  };

  const getTotalPercentage = () => {
    return Object.values(customWeights).reduce((sum, weight) => sum + weight, 0) * 100;
  };

  const canShowAnalysisButtons = () => {
    if (selectedStrategy === 1 || selectedStrategy === 2) {
      return true;
    } else if (selectedStrategy === 3) {
      return aiPortfolioResult && aiPortfolioResult.ai_optimization?.recommended_allocations;
    }
    return false;
  };

  const getCompletedSteps = () => {
    let completed = 0;
    if (selectedStocks.length > 0) completed++;
    if (selectedStrategy && (selectedStrategy !== 3 || aiPortfolioResult)) completed++;
    if (riskProfile) completed++;
    if (investmentAmount > 0) completed++;
    return completed;
  };

  // NEW: Show About page if showAboutPage is true
if (showAboutPage) {
  return <AboutPage onBackToPortfolio={() => setShowAboutPage(false)} />;
}

  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      background: 'var(--bg)',
      color: 'var(--text-primary)',
      lineHeight: '1.6',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      minHeight: '100vh'
    }}>
      {/* Inject CSS Variables */}
      <style>{cssVars}</style>


      {/* Mobile Notice */}
      <div className="mobile-notice">
        📱 For the best experience, please view on desktop or tablet
      </div>

      {/* Header */}
      <header style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 1000,
        height: '60px',
        background: 'rgba(8,14,26,0.92)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              fontSize: '17px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              letterSpacing: '0.01em',
              fontFamily: "'Inter', sans-serif",
            }}>
              AlphaKnaut
            </div>
            <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.14)' }} />
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '10px',
              letterSpacing: '0.12em',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
            }}>
              Macro Intelligence
            </div>
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Live indicator */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '10px', letterSpacing: '0.1em',
              color: 'var(--success)', textTransform: 'uppercase',
            }}>
              <div style={{
                width: '5px', height: '5px', borderRadius: '50%',
                background: 'var(--success)',
                boxShadow: '0 0 6px var(--success)',
                animation: 'pulse 2.5s infinite',
              }} />
              Live
            </div>
            <style>{`
              @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
              @keyframes headerFadeIn { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:none} }
            `}</style>

            {/* About button */}
            <button
              onClick={() => setShowAboutPage(true)}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '13px', fontWeight: '400',
                color: 'var(--text-muted)',
                background: 'transparent', border: 'none',
                cursor: 'pointer', padding: '6px 14px',
                borderRadius: '4px',
                transition: 'all 0.15s',
                letterSpacing: '0.01em',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              About
            </button>

            {/* CTA */}
            <button
              onClick={() => {
                document.querySelector('#portfolio-constructor')?.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '12px', fontWeight: '500',
                letterSpacing: '0.02em',
                padding: '7px 18px',
                background: 'var(--accent)',
                color: '#fff',
                border: 'none', borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background 0.15s, transform 0.15s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'var(--accent-light)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'var(--accent)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Launch Platform →
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        padding: '140px 32px 80px',
        maxWidth: '1200px',
        margin: '0 auto',
        marginTop: '60px',
        position: 'relative',
      }}>
        {/* Subtle grid background */}
        <div style={{
          position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%)',
        }} />
        {/* Glow */}
        <div style={{
          position: 'absolute', top: '0', left: '-5%',
          width: '50vw', height: '50vw', zIndex: 0, pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(45,126,255,0.07) 0%, transparent 65%)',
        }} />

        <div style={{ maxWidth: '760px', position: 'relative', zIndex: 1 }}>
          {/* Eyebrow */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase',
            color: 'var(--accent-light)',
            marginBottom: '1.8rem',
          }}>
            <div style={{ width: '20px', height: '1px', background: 'var(--accent)' }} />
            AI-Powered Macro Intelligence · Magnificent 7
          </div>

          <h1 style={{
            fontSize: window.innerWidth <= 768 ? (window.innerWidth <= 480 ? '36px' : '44px') : '72px',
            fontWeight: '300',
            fontFamily: "'Inter', sans-serif",
            lineHeight: window.innerWidth <= 768 ? '1.15' : '1.08',
            color: 'var(--text-primary)',
            marginBottom: '1.5rem',
            letterSpacing: window.innerWidth <= 768 ? '-1px' : '-2px',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
          }}>
            AI-Powered Portfolio<br/>
            <span style={{ fontWeight: '600' }}>Optimization</span>
          </h1>

          <p style={{
            fontSize: '17px',
            fontWeight: '300',
            color: 'var(--text-secondary)',
            lineHeight: '1.8',
            marginBottom: '2.5rem',
            letterSpacing: '0.01em',
            maxWidth: '520px',
          }}>
            Precision-built portfolios centered on the Magnificent 7 — combining real-time market intelligence, 
            macroeconomic signals, and institutional-grade AI reasoning to surface actionable portfolio insights.
          </p>

          {/* Stats row */}
          <div style={{
            display: 'flex', gap: '0',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: '2rem',
            marginBottom: '2.5rem',
          }}>
            {[
              { val: '$17.4T', lbl: 'Combined Market Cap' },
              { val: '34.1%', lbl: 'S&P 500 Weight' },
              { val: 'Claude AI', lbl: 'Reasoning Engine' },
              { val: '6 weeks', lbl: 'Built from zero' },
            ].map((s, i) => (
              <div key={i} style={{
                paddingRight: '2rem', marginRight: '2rem',
                borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none',
              }}>
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '16px', fontWeight: '500',
                  color: 'var(--text-primary)', display: 'block', marginBottom: '3px',
                }}>{s.val}</div>
                <div style={{
                  fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.01em',
                }}>{s.lbl}</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              document.querySelector('#portfolio-constructor')?.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '13px', fontWeight: '500',
              letterSpacing: '0.02em',
              padding: '12px 28px',
              background: 'var(--accent)',
              color: '#fff',
              border: 'none', borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background 0.15s, transform 0.15s, box-shadow 0.15s',
              boxShadow: '0 6px 20px rgba(45,126,255,0.2)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'var(--accent-light)';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 10px 28px rgba(45,126,255,0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'var(--accent)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(45,126,255,0.2)';
            }}
          >
            Start Building Portfolio →
          </button>
        </div>
      </section>
      {/* Caution Banner */}
      <div style={{
        background: 'rgba(239, 68, 68, 0.05)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        padding: '16px 32px',
        textAlign: 'center',
        fontSize: '14px',
        color: 'var(--error)',
        fontWeight: '500'
      }}>
        ⚠️ This AI-powered investment research tool is designed for educational purposes and portfolio analysis. AI systems can generate inaccurate information and hallucinations, so always consult qualified financial professionals before making investment decisions.
      </div>

      {/* Stats Section */}
      <section style={{
        padding: '80px 24px',
        background: 'var(--bg2)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '48px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '48px',
              fontWeight: '800',
              color: '#ffffff',
              marginBottom: '8px',
              letterSpacing: '-1px'
            }}>
              $17.4T
            </div>
            <div style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.8)',
              fontWeight: '500'
            }}>
              Combined Market Cap
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '48px',
              fontWeight: '800',
              color: '#ffffff',
              marginBottom: '8px',
              letterSpacing: '-1px'
            }}>
              34.1%
            </div>
            <div style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.8)',
              fontWeight: '500'
            }}>
              S&P 500 Weight
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '48px',
              fontWeight: '800',
              color: '#ffffff',
              marginBottom: '8px',
              letterSpacing: '-1px'
            }}>
              7
            </div>
            <div style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.8)',
              fontWeight: '500'
            }}>
              Technology Leaders
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '48px',
              fontWeight: '800',
              color: '#ffffff',
              marginBottom: '8px',
              letterSpacing: '-1px'
            }}>
              AI
            </div>
            <div style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.8)',
              fontWeight: '500'
            }}>
              Powered Analysis
            </div>
          </div>
        </div>
      </section>

      {/* Progress Indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '64px 0',
        gap: '16px'
      }}>
        {[
  { num: 1, label: 'Assets', completed: selectedStocks.length > 0 },
  { num: 2, label: 'Strategy', completed: selectedStrategy > 0 },
  { num: 3, label: 'Risk', completed: riskProfile !== '' },
  { num: 4, label: 'Capital', completed: investmentAmount > 0 },
  { num: 5, label: 'Analysis', completed: enhancedPredictions !== null },
].map((step, index) => (
  <React.Fragment key={step.num}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: step.completed ? 'var(--gradient-success)' : 'var(--surface-elevated)',
        border: step.completed ? '2px solid var(--success)' : '2px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '600',
        fontSize: '14px',
        color: step.completed ? 'white' : 'var(--text-muted)',
        transition: 'all 0.3s ease',
        boxShadow: step.completed ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none'
      }}>
        {step.completed ? '✓' : step.num}
      </div>
      <span style={{
        fontSize: '14px',
        color: 'var(--text-muted)',
        fontWeight: '500'
      }}>
        {step.label}
      </span>
    </div>
    {index < 5 && (
      <div style={{
        width: '60px',
        height: '2px',
        background: step.completed ? 'var(--gradient-success)' : 'var(--border)',
        transition: 'background 0.3s ease'
      }} />
    )}
  </React.Fragment>
))}
 
      </div>

      {/* Main Platform */}
      <section id="portfolio-constructor" style={{
        padding: '16px 32px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <h2 style={{
            fontSize: '56px',
            fontWeight: '700',
            color: 'var(--text-primary)',
            marginBottom: '20px',
            letterSpacing: '-1.5px'
          }}>
            Portfolio Constructor
          </h2>
          <p style={{
            fontSize: '22px',
            color: 'var(--text-secondary)',
            maxWidth: '680px',
            margin: '0 auto',
            lineHeight: '1.5',
            letterSpacing: '-0.3px'
          }}>
            Institutional-grade portfolio optimization with AI-powered risk assessment and real-time market intelligence
          </p>
        </div>

        <div style={{
          background: 'var(--surface)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-xl)'
        }}>
          <div style={{
            padding: '40px',
            background: 'var(--surface-elevated)',
            borderBottom: '1px solid var(--border)'
          }}>
            <h3 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: 'var(--text-primary)',
              marginBottom: '12px',
              letterSpacing: '-0.5px'
            }}>
              Investment Configuration
            </h3>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '18px',
              letterSpacing: '-0.2px'
            }}>
              Configure your portfolio parameters for optimal asset allocation
            </p>
          </div>
          
          <div style={{ padding: '0' }}>
            {/* Step 1: Asset Selection */}
            <StepSection
              stepNumber={1}
              title="Asset Universe"
              description="Select technology leaders for portfolio construction"
              isOpen={openSteps[1]}
              onToggle={() => toggleStep(1)}
              isCompleted={selectedStocks.length > 0}
              taskColor="var(--accent)"
              taskDescription="Select 1-7 companies that will form your investment universe. These selections determine your portfolio's foundation and risk characteristics. The Magnificent 7 represent the most influential technology companies driving global markets."
            >
              <p style={{
                color: 'var(--text-secondary)',
                marginBottom: '24px',
                fontSize: '16px',
                lineHeight: '1.6'
              }}>
                Choose companies from the Magnificent 7 technology leaders. These assets represent 34.1% of S&P 500 market capitalization 
                and control approximately $17.4 trillion in market value.
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '20px',
                marginTop: '32px'
              }}>
                {magnificent7.map(stock => (
                  <div 
                    key={stock}
                    style={{
                      padding: '28px',
                      border: selectedStocks.includes(stock) ? '1.5px solid var(--accent)' : '1.5px solid var(--border)',
                      borderRadius: '14px',
                      background: selectedStocks.includes(stock) ? 'var(--surface-accent)' : 'var(--surface)',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      position: 'relative',
                      boxShadow: selectedStocks.includes(stock) ? 'var(--shadow-accent)' : 'none'
                    }}
                    onClick={() => {
                      if (selectedStocks.includes(stock)) {
                        setSelectedStocks(selectedStocks.filter(s => s !== stock));
                      } else {
                        setSelectedStocks([...selectedStocks, stock]);
                      }
                    }}
                    onMouseOver={(e) => {
                      if (!selectedStocks.includes(stock)) {
                        e.currentTarget.style.borderColor = 'var(--accent-light)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-accent)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!selectedStocks.includes(stock)) {
                        e.currentTarget.style.borderColor = 'var(--border)';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.transform = 'translateY(0px)';
                      }
                    }}
                  >
                    <div style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: 'var(--text-primary)',
                      marginBottom: '8px'
                    }}>
                      {stock}
                    </div>
                    {stockData[stock] && (
                      <>
                        <div style={{
                          fontSize: '16px',
                          color: 'var(--text-secondary)',
                          marginBottom: '4px'
                        }}>
                          ${stockData[stock].price?.toFixed(2)}
                        </div>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          display: 'inline-block',
                          color: stockData[stock].change >= 0 ? 'var(--success)' : 'var(--error)',
                          background: stockData[stock].change >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
                        }}>
                          {stockData[stock].change >= 0 ? '+' : ''}{stockData[stock].change?.toFixed(2)}%
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </StepSection>

            {/* Step 2: Strategy Selection */}
            <StepSection
              stepNumber={2}
              title="Allocation Strategy"
              description="Choose your portfolio construction methodology"
              isOpen={openSteps[2]}
              onToggle={() => toggleStep(2)}
              isCompleted={selectedStrategy > 0}
              taskColor="var(--accent-purple)"
              taskDescription="Choose how your capital will be distributed across your selected stocks. Each strategy offers different levels of control and sophistication - from simple equal weighting to advanced AI-driven optimization that adapts to market conditions."
            >
              <p style={{
                color: 'var(--text-secondary)',
                marginBottom: '32px',
                fontSize: '16px',
                lineHeight: '1.6'
              }}>
                Select your portfolio construction methodology. Each approach offers varying degrees of control and AI assistance for maximizing risk-adjusted returns.
              </p>
              <div style={{ display: 'grid', gap: '20px', marginTop: '24px' }}>
                {[
                  {
                    id: 1,
                    title: 'Equal Weight Distribution',
                    description: 'Systematic diversification with automatic rebalancing. Distributes capital equally across selected assets for maximum diversification benefit.',
                    features: ['Automatic Rebalancing', 'Maximum Diversification', 'Risk Optimized']
                  },
                  {
                    id: 2,
                    title: 'Custom Allocation',
                    description: 'Granular control over position sizing with AI-powered risk monitoring and concentration analysis.',
                    features: ['Precision Control', 'AI Risk Monitoring', 'Advanced Analytics']
                  },
                  {
                    id: 3,
                    title: 'AI Optimization',
                    description: 'Institutional-grade AI determines optimal allocations based on market conditions and quantitative analysis.',
                    features: ['Machine Learning', 'Market Intelligence', 'Dynamic Optimization']
                  }
                ].map(strategy => (
                  <div
                    key={strategy.id}
                    style={{
                      padding: '24px',
                      border: selectedStrategy === strategy.id ? '1px solid var(--accent)' : '1px solid var(--border)',
                      borderRadius: '12px',
                      background: selectedStrategy === strategy.id ? 'var(--surface-accent)' : 'var(--surface)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: selectedStrategy === strategy.id ? 'var(--shadow-accent)' : 'none'
                    }}
                    onClick={() => selectStrategy(strategy.id)}
                    onMouseOver={(e) => {
                      if (selectedStrategy !== strategy.id) {
                        e.currentTarget.style.borderColor = 'var(--accent-light)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-accent)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (selectedStrategy !== strategy.id) {
                        e.currentTarget.style.borderColor = 'var(--border)';
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '16px'
                    }}>
                      <div style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: 'var(--text-primary)'
                      }}>
                        {strategy.title}
                      </div>
                      <input 
                        type="radio" 
                        name="strategy" 
                        checked={selectedStrategy === strategy.id}
                        onChange={() => {}}
                        style={{ accentColor: 'var(--accent)' }}
                      />
                    </div>
                    <div style={{
                      color: 'var(--text-secondary)',
                      lineHeight: '1.5',
                      marginBottom: '16px'
                    }}>
                      {strategy.description}
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: '16px',
                      flexWrap: 'wrap'
                    }}>
                      {strategy.features.map(feature => (
                        <span
                          key={feature}
                          style={{
                            padding: '4px 8px',
                            background: 'var(--surface-elevated)',
                            border: '1px solid var(--border)',
                            borderRadius: '4px',
                            fontSize: '12px',
                            color: 'var(--text-secondary)',
                            fontWeight: '500'
                          }}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Strategy-specific content */}
              {selectedStrategy === 1 && (
                <div style={{
                  marginTop: '32px',
                  padding: '24px',
                  background: 'var(--surface-emerald)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: '12px'
                }}>
                  <h4 style={{
                    color: 'var(--success)',
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: '12px'
                  }}>
                    📊 Equal Weight Allocation
                  </h4>
                  <div style={{
                    fontSize: '0.95rem',
                    color: 'var(--accent)',
                    fontWeight: 600
                  }}>
                    {selectedStocks.map(stock => `${stock}: ${(100 / selectedStocks.length).toFixed(1)}%`).join(' | ')}
                  </div>
                </div>
              )}

              {selectedStrategy === 2 && (
                <div style={{ marginTop: '32px' }}>
                  {selectedStocks.map(stock => (
                    <div key={stock} style={{
                      marginBottom: '20px',
                      padding: '20px',
                      background: 'var(--surface-elevated)',
                      borderRadius: '12px',
                      border: '1px solid var(--border)'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '12px'
                      }}>
                        <span style={{
                          fontWeight: '600',
                          color: 'var(--text-primary)',
                          fontSize: '16px'
                        }}>
                          {stock} {userSetStocks.has(stock) ? '🔒' : '🔓'}
                        </span>
                        <span style={{
                          fontWeight: '700',
                          color: 'var(--accent)',
                          fontSize: '18px'
                        }}>
                          {((customWeights[stock] || 0) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={customWeights[stock] || 0}
                        onInput={(e) => updateCustomWeight(stock, parseFloat((e.target as HTMLInputElement).value))}
                        onChange={(e) => updateCustomWeight(stock, parseFloat(e.target.value))}
                        style={{
                          width: '100%',
                          height: '8px',
                          borderRadius: '4px',
                          background: 'var(--gradient-primary)',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      />
                    </div>
                  ))}
                  
                  <div style={{
                    marginTop: '20px',
                    padding: '18px',
                    background: getTotalPercentage() > 100 ? 'rgba(239, 68, 68, 0.15)' : 
                                getTotalPercentage() === 100 ? 'var(--surface-emerald)' : 'rgba(6, 182, 212, 0.15)',
                    borderRadius: '12px',
                    border: getTotalPercentage() > 100 ? '2px solid var(--error)' : 
                            getTotalPercentage() === 100 ? '2px solid var(--success)' : '2px solid #06b6d4',
                    fontWeight: '700',
                    fontSize: '1.2rem',
                    textAlign: 'center',
                    color: getTotalPercentage() > 100 ? 'var(--error)' : 
                           getTotalPercentage() === 100 ? 'var(--success)' : '#06b6d4'
                  }}>
                    📊 Total Portfolio Allocation: {getTotalPercentage().toFixed(1)}%
                  </div>

                  {shouldShowAlternatives() && (
                    <div style={{
                      marginTop: '24px',
                      padding: '20px',
                      background: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      borderRadius: '12px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '12px'
                      }}>
                        <span>⚠️</span>
                        <strong style={{ color: 'var(--warning)' }}>AI Risk Detection Alert</strong>
                      </div>
                      <div style={{
                        fontSize: '0.95rem',
                        color: 'var(--text-secondary)',
                        marginBottom: '15px'
                      }}>
                        High concentration risk detected. AI recommends diversifying with QQQ ETF or expanding to additional tech stocks for optimal risk-adjusted returns.
                      </div>
                      <button 
                        onClick={getAIOptimization}
                        style={{
                          padding: '12px 24px',
                          background: 'var(--gradient-warm)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        🤖 Get AI Alternative Strategies
                      </button>
                    </div>
                  )}

                  {aiOptimization && aiOptimization.ai_analysis?.alternatives && (
                    <div style={{
                      marginTop: '20px',
                      padding: '20px',
                      background: 'rgba(15, 23, 42, 0.05)',
                      borderRadius: '12px',
                      border: '1px solid rgba(251, 191, 36, 0.3)'
                    }}>
                      <h4 style={{
                        color: 'var(--warning)',
                        marginBottom: '15px',
                        textAlign: 'center'
                      }}>
                        🤖 AI Alternative Investment Strategies
                      </h4>
                      {aiOptimization.ai_analysis.alternatives.alternatives_needed && (
                        <div style={{
                          padding: '15px',
                          background: 'var(--surface)',
                          borderRadius: '8px',
                          border: '1px solid var(--border)'
                        }}>
                          <strong style={{
                            color: 'var(--warning)',
                            marginBottom: '10px',
                            display: 'block'
                          }}>
                            📋 Detailed Recommendations:
                          </strong>
                          <div style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.9rem',
                            lineHeight: '1.5',
                            whiteSpace: 'pre-wrap'
                          }}>
                            {aiOptimization.ai_analysis.alternatives.detailed_recommendations || 
                             aiOptimization.ai_analysis.alternatives.claude_suggestions}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {selectedStrategy === 3 && (
                <div style={{ marginTop: '32px' }}>
                  <div style={{
                    textAlign: 'center',
                    padding: '24px',
                    background: 'var(--surface-purple)',
                    borderRadius: '12px',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    marginBottom: '20px'
                  }}>
                    <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🧠</div>
                    <div style={{
                      fontWeight: '700',
                      color: 'var(--accent-purple)',
                      marginBottom: '8px'
                    }}>
                      AI Portfolio Manager
                    </div>
                    <div style={{
                      fontSize: '0.9rem',
                      color: 'var(--text-secondary)'
                    }}>
                      Real-time analysis + Stock evaluation + Optimal allocation decisions
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <button
                      onClick={getAIPortfolioOptimization}
                      disabled={aiPortfolioLoading || selectedStocks.length === 0}
                      style={{
                        padding: '15px 30px',
                        background: aiPortfolioLoading ? 'var(--text-muted)' : 'var(--gradient-primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        cursor: aiPortfolioLoading ? 'not-allowed' : 'pointer',
                        fontWeight: '700',
                        fontSize: '1.1rem',
                        transition: 'all 0.3s ease',
                        boxShadow: 'var(--shadow-accent)'
                      }}
                    >
                      {aiPortfolioLoading ? '🧠 AI Analyzing Portfolio...' : '🚀 Get AI Portfolio Manager Decision'}
                    </button>
                  </div>

                  {aiPortfolioResult && (
                    <div style={{
                      marginTop: '25px',
                      padding: '25px',
                      background: 'rgba(248, 250, 252, 0.8)',
                      borderRadius: '16px',
                      border: '2px solid rgba(139, 92, 246, 0.4)'
                    }}>
                      <h4 style={{
                        color: 'var(--accent-purple)',
                        marginBottom: '20px',
                        textAlign: 'center'
                      }}>
                        🧠 AI Portfolio Manager Decision
                      </h4>
                      
                      {aiPortfolioResult.ai_optimization && (
                        <div>
                          <div style={{
                            marginBottom: '20px',
                            padding: '15px',
                            background: 'var(--surface-purple)',
                            borderRadius: '12px',
                            border: '1px solid rgba(139, 92, 246, 0.3)'
                          }}>
                            <div style={{
                              fontWeight: '700',
                              color: 'var(--accent-purple)',
                              marginBottom: '10px'
                            }}>
                              📊 AI Decision: {aiPortfolioResult.ai_optimization.ai_decision}
                            </div>
                            <div style={{
                              color: 'var(--text-secondary)',
                              fontSize: '0.9rem'
                            }}>
                              Investment: ${aiPortfolioResult.ai_optimization.investment_amount?.toLocaleString()} | 
                              Risk Profile: {aiPortfolioResult.ai_optimization.risk_profile} | 
                              Confidence: {aiPortfolioResult.ai_optimization.confidence_level}
                            </div>
                          </div>

                          {aiPortfolioResult.ai_optimization.recommended_allocations && (
                            <div style={{
                              marginBottom: '20px',
                              padding: '15px',
                              background: 'var(--surface)',
                              borderRadius: '12px',
                              border: '1px solid var(--border)'
                            }}>
                              <strong style={{
                                color: '#06b6d4',
                                marginBottom: '15px',
                                display: 'block'
                              }}>
🎯 AI Recommended Allocations:
                              </strong>
                              <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                                gap: '10px'
                              }}>
                                {(() => {
                                  // Extract allocations from the JSON in ai_reasoning
                                  let allocations = aiPortfolioResult.ai_optimization.recommended_allocations;
                                  
                                  // Try to get allocations from the JSON response instead
                                  try {
                                    const reasoning = aiPortfolioResult.ai_optimization.ai_reasoning;
                                    if (typeof reasoning === 'string' && reasoning.trim().startsWith('{')) {
                                      const cleaned = reasoning.trim()
                                        .replace(/[\u0000-\u001F\u007F-\u009F]/g, ' ')
                                        .replace(/[\n\r\t]/g, ' ')
                                        .replace(/\s+/g, ' ')
                                        .trim();
                                      
                                      const parsed = JSON.parse(cleaned);
                                      if (parsed.allocations) {
                                        allocations = parsed.allocations;
                                        console.log('✅ Using allocations from JSON:', allocations);
                                      }
                                    }
                                  } catch (e) {
                                    console.log('Using fallback allocations');
                                  }
                                  
                                  return Object.entries(allocations).map(([stock, weight]) => (
                                    <div key={stock} style={{
                                      padding: '10px',
                                      background: 'rgba(6, 182, 212, 0.1)',
                                      borderRadius: '8px',
                                      border: '1px solid rgba(6, 182, 212, 0.3)',
                                      textAlign: 'center'
                                    }}>
                                      <div style={{
                                        fontWeight: '700',
                                        color: '#06b6d4'
                                      }}>
                                        {stock}
                                      </div>
                                      <div style={{
                                        color: 'var(--text-primary)',
                                        fontSize: '1.1rem',
                                        fontWeight: '600'
                                      }}>
{typeof weight === 'number' ? (weight > 1 ? weight.toFixed(1) : (weight * 100).toFixed(1)) : weight}%                                      </div>
                                    </div>
                                  ));
                                })()}
                              </div>
                            </div>
                          )}

                          <div style={{
                            padding: '20px',
                            background: 'var(--surface)',
                            borderRadius: '12px',
                            border: '1px solid var(--border)'
                          }}>
                            <strong style={{
                              color: 'var(--accent-purple)',
                              marginBottom: '15px',
                              display: 'block'
                            }}>
                              🧠 AI Portfolio Manager Reasoning:
                            </strong>
                            <div style={{
                              color: 'var(--text-secondary)',
                              fontSize: '0.95rem',
                              lineHeight: '1.6',
                              whiteSpace: 'pre-wrap'
                            }}>
                              {(() => {
                                let reasoning = aiPortfolioResult.ai_optimization.ai_reasoning;
                                console.log('🔍 Raw reasoning:', reasoning.substring(0, 100));
                                
                                if (typeof reasoning === 'string') {
                                  const trimmed = reasoning.trim();
                                  
                                  // Check if it contains JSON structure
                                  if (trimmed.includes('ai_reasoning') && trimmed.includes('{')) {
                                    try {
                                      // Extract just the ai_reasoning content from nested JSON
                                      let match = trimmed.match(/"ai_reasoning":\s*"([^"]+)"/);
                                      if (match && match[1]) {
                                        console.log('✅ Found nested ai_reasoning');
                                        let extracted = match[1]
                                          // Unescape JSON string
                                          .replace(/\\"/g, '"')
                                          .replace(/\\n/g, '\n')
                                          // Format with proper sections
                                          .replace(/(\d+\.\s*[A-Z]{3,5}\s*\([^)]+\):)/g, '\n\n**$1**\n')
                                          .replace(/(\d+\.\s*QQQ\s*\([^)]+\):)/g, '\n\n**$1**\n')
                                          // Clean up spacing
                                          .replace(/\n{3,}/g, '\n\n')
                                          .trim();
                                        
                                        return extracted;
                                      }
                                      
                                      // If that doesn't work, try parsing the full JSON
                                      let cleaned = trimmed.match(/\{.*\}/)?.[0];
                                      if (cleaned) {
                                        const parsed = JSON.parse(cleaned);
                                        if (parsed.ai_reasoning) {
                                          return parsed.ai_reasoning
                                            .replace(/(\d+\.\s*[A-Z]{3,5}\s*\([^)]+\):)/g, '\n\n**$1**\n')
                                            .replace(/\n{3,}/g, '\n\n')
                                            .trim();
                                        }
                                      }
                                    } catch (e) {
                                      console.log('❌ JSON parsing error:', e.message);
                                    }
                                  }
                                }
                                
                                console.log('⚠️ Using raw text');
                                return reasoning;
                              })()}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </StepSection>

            {/* Step 3: Risk Framework */}
            <StepSection
              stepNumber={3}
              title="Risk Framework"
              description="Define risk tolerance and position sizing constraints"
              isOpen={openSteps[3]}
              onToggle={() => toggleStep(3)}
              isCompleted={riskProfile !== ''}
              taskColor="var(--success)"
              taskDescription="Define your risk tolerance to calibrate the AI's recommendations and portfolio constraints. This ensures your portfolio aligns with your investment goals, time horizon, and comfort level with volatility and potential drawdowns."
            >
              <div style={{ display: 'grid', gap: '20px' }}>
                {[
                  {
                    id: 'conservative',
                    title: 'Conservative',
                    description: 'Capital preservation focused. Maximum 20% position sizing with lower volatility tolerance.',
                    emoji: '🛡️'
                  },
                  {
                    id: 'moderate',
                    title: 'Balanced',
                    description: 'Optimal risk-reward equilibrium. Maximum 30% position sizing with controlled volatility parameters.',
                    emoji: '📈'
                  },
                  {
                    id: 'aggressive',
                    title: 'Growth',
                    description: 'Growth maximization focused. Maximum 50% position sizing for concentrated alpha generation.',
                    emoji: '🚀'
                  }
                ].map(risk => (
                  <div
                    key={risk.id}
                    style={{
                      padding: '24px',
                      border: riskProfile === risk.id ? '1px solid var(--accent)' : '1px solid var(--border)',
                      borderRadius: '12px',
                      background: riskProfile === risk.id ? 'var(--surface-accent)' : 'var(--surface)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: riskProfile === risk.id ? 'var(--shadow-accent)' : 'none'
                    }}
                    onClick={() => setRiskProfile(risk.id)}
                    onMouseOver={(e) => {
                      if (riskProfile !== risk.id) {
                        e.currentTarget.style.borderColor = 'var(--accent-light)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-accent)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (riskProfile !== risk.id) {
                        e.currentTarget.style.borderColor = 'var(--border)';
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                  >
                    <div style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      marginBottom: '8px'
                    }}>
                      {risk.emoji} {risk.title}
                    </div>
                    <div style={{
                      color: 'var(--text-secondary)',
                      lineHeight: '1.5'
                    }}>
                      {risk.description}
                    </div>
                  </div>
                ))}
              </div>
            </StepSection>

            {/* Step 4: Investment Capital */}
            <StepSection
              stepNumber={4}
              title="Investment Capital"
              description="Specify total capital deployment amount"
              isOpen={openSteps[4]}
              onToggle={() => toggleStep(4)}
              isCompleted={investmentAmount > 0}
              taskColor="var(--warning)"
              taskDescription="Specify your total investment capital. This determines individual position sizes, helps calculate transaction costs, and enables the AI to provide realistic projections tailored to your specific capital base and investment scale."
            >
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: '8px'
                }}>
                  Investment Amount
                </label>
                <input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                  placeholder="Enter amount"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    background: 'var(--surface)',
                    color: 'var(--text-primary)',
                    fontSize: '16px',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--accent)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                gap: '12px',
                marginTop: '16px'
              }}>
                {[25000, 50000, 100000, 250000, 500000, 1000000].map(amount => (
                  <div
                    key={amount}
                    style={{
                      padding: '12px',
                      border: investmentAmount === amount ? '1px solid var(--accent)' : '1px solid var(--border)',
                      borderRadius: '8px',
                      background: investmentAmount === amount ? 'var(--surface-accent)' : 'var(--surface)',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontWeight: '500',
                      color: investmentAmount === amount ? 'var(--accent)' : 'var(--text-primary)',
                      boxShadow: investmentAmount === amount ? 'var(--shadow-accent)' : 'none'
                    }}
                    onClick={() => selectQuickAmount(amount)}
                    onMouseOver={(e) => {
                      if (investmentAmount !== amount) {
                        e.currentTarget.style.borderColor = 'var(--accent-light)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (investmentAmount !== amount) {
                        e.currentTarget.style.borderColor = 'var(--border)';
                      }
                    }}
                  >
                    ${amount >= 1000000 ? `${amount/1000000}M` : `${amount/1000}K`}
                  </div>
                ))}
              </div>

              {/* Timeline Selection */}
              <div style={{ marginTop: '32px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: '16px'
                }}>
                  Investment Timeline
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '16px'
                }}>
                  {[
                    { years: 1, emoji: '1️⃣', desc: 'Short-term growth' },
                    { years: 3, emoji: '3️⃣', desc: 'Optimal horizon' },
                    { years: 5, emoji: '5️⃣', desc: 'Long-term wealth' }
                  ].map(({ years, emoji, desc }) => (
                    <div
                      key={years}
                      style={{
                        padding: '20px',
                        border: selectedTimeframe === years ? '1px solid var(--accent)' : '1px solid var(--border)',
                        borderRadius: '12px',
                        background: selectedTimeframe === years ? 'var(--surface-accent)' : 'var(--surface)',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: selectedTimeframe === years ? 'var(--shadow-accent)' : 'none'
                      }}
                      onClick={() => setSelectedTimeframe(years)}
                      onMouseOver={(e) => {
                        if (selectedTimeframe !== years) {
                          e.currentTarget.style.borderColor = 'var(--accent-light)';
                          e.currentTarget.style.boxShadow = 'var(--shadow-accent)';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (selectedTimeframe !== years) {
                          e.currentTarget.style.borderColor = 'var(--border)';
                          e.currentTarget.style.boxShadow = 'none';
                        }
                      }}
                    >
                      <span style={{ fontSize: '2rem', display: 'block', marginBottom: '8px' }}>{emoji}</span>
                      <div style={{ fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                        {years} Year{years !== 1 ? 's' : ''}
                      </div>
                      <div style={{ 
                        fontSize: '0.8rem', 
                        color: selectedTimeframe === years ? 'var(--accent)' : 'var(--text-muted)'
                      }}>
                        {desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </StepSection>

            {/* Step 5: Portfolio Analysis */}
            <StepSection
              stepNumber={5}
              title="Portfolio Analysis & Benchmarks"
              description="Generate AI-powered investment intelligence"
              isOpen={openSteps[5]}
              onToggle={() => toggleStep(5)}
              isCompleted={enhancedPredictions !== null}
              taskColor="var(--error)"
              taskDescription="Generate comprehensive AI-powered analysis of your portfolio configuration. The system will analyze your selections, provide performance projections, assess risk metrics, and compare your portfolio against market benchmarks to give you actionable insights."
            >
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                {canShowAnalysisButtons() && (
                  <>
                    <button
                      onClick={getEnhancedPredictions}
                      disabled={loading || economicLoading}
                      style={{
                        padding: '18px 36px',
                        background: loading || economicLoading ? 'var(--text-muted)' : 'var(--gradient-primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: loading || economicLoading ? 'not-allowed' : 'pointer',
                        fontWeight: '600',
                        fontSize: '17px',
                        transition: 'all 0.25s ease',
                        boxShadow: 'var(--shadow-accent)',
                        letterSpacing: '-0.2px',
                        marginRight: '16px',
                        marginBottom: '16px'
                      }}
                    >
                      {loading || economicLoading ? 
                        `🔮 Claude Analyzing ${selectedTimeframe}-Year Forecast...` : 
                        '🚀 Deploy Analysis Engine'
                      }
                    </button>

                    <button
                      onClick={getBenchmarkComparison}
                      disabled={benchmarkLoading}
                      style={{
                        padding: '18px 36px',
                        background: 'transparent',
                        color: 'var(--text-primary)',
                        border: '1.5px solid var(--border)',
                        borderRadius: '10px',
                        cursor: benchmarkLoading ? 'not-allowed' : 'pointer',
                        fontWeight: '600',
                        fontSize: '17px',
                        transition: 'all 0.25s ease',
                        letterSpacing: '-0.2px',
                        marginBottom: '16px'
                      }}
                      onMouseOver={(e) => {
                        if (!benchmarkLoading) {
                          e.currentTarget.style.background = 'var(--surface-hover)';
                          e.currentTarget.style.borderColor = 'var(--text-muted)';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!benchmarkLoading) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.borderColor = 'var(--border)';
                        }
                      }}
                    >
                      {benchmarkLoading ? 
                        '📊 Generating Benchmark Analysis...' : 
                        '📈 Benchmark Comparison'
                      }
                    </button>


		{/* ADD THE MONTE CARLO BUTTON RIGHT HERE */}
                    <button
                      onClick={getMonteCarloAnalysis}
                      disabled={monteCarloLoading}
                      style={{
                        padding: '18px 36px',
                        background: monteCarloLoading ? 'var(--text-muted)' : 'var(--gradient-warm)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: monteCarloLoading ? 'not-allowed' : 'pointer',
                        fontWeight: '600',
                        fontSize: '17px',
                        transition: 'all 0.25s ease',
                        letterSpacing: '-0.2px',
                        marginBottom: '16px',
                        marginRight: '16px'
                      }}
                    >
			{monteCarloLoading ? 
                        '🎲 Running 10,000 Simulations...' : 
                        '📊 Monte Carlo Analysis'
                      }
                    </button>

                  </>
                )}
              </div>

              {/* Enhanced Predictions Display */}
              {enhancedPredictions && canShowAnalysisButtons() && (
                <div style={{
                  marginTop: '32px',
                  padding: '32px',
                  background: 'var(--surface-elevated)',
                  borderRadius: '12px',
                  border: '1px solid var(--border)'
                }}>
                  <h4 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    marginBottom: '16px',
                    color: 'var(--text-primary)'
                  }}>
                    🔮 AI Portfolio Analysis Results
                  </h4>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '24px',
                    marginBottom: '32px'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        fontSize: '32px',
                        fontWeight: '700',
                        background: 'var(--gradient-success)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}>
                        ${enhancedPredictions.enhanced_predictions?.predicted_dollar_value?.toLocaleString() || '127,400'}
                      </div>
                      <div style={{
                        color: 'var(--text-secondary)',
                        fontSize: '14px'
                      }}>
                        Projected Value ({selectedTimeframe}Y)
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        fontSize: '32px',
                        fontWeight: '700',
                        background: 'var(--gradient-primary)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}>
                        {enhancedPredictions.enhanced_predictions?.timeframe || '3 years'}
                      </div>
                      <div style={{
                        color: 'var(--text-secondary)',
                        fontSize: '14px'
                      }}>
                        Investment Horizon
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        fontSize: '32px',
                        fontWeight: '700',
                        background: 'var(--gradient-warm)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}>
                        AI
                      </div>
                      <div style={{
                        color: 'var(--text-secondary)',
                        fontSize: '14px'
                      }}>
                        Powered Analysis
                      </div>
                    </div>
                  </div>
                  
                  <div style={{
                    padding: '24px',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    marginBottom: '24px'
                  }}>
                    <h5 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      marginBottom: '12px',
                      color: 'var(--text-primary)'
                    }}>
                      🧠 Claude's Market Intelligence Analysis:
                    </h5>
                    <div style={{
                      color: 'var(--text-secondary)',
                      lineHeight: '1.6',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {enhancedPredictions.enhanced_predictions?.analysis_text || 
                       'Based on current market conditions and AI analysis, your portfolio demonstrates strong risk-adjusted returns with optimal diversification across technology leaders. The allocation provides balanced exposure while minimizing concentration risk.'}
                    </div>
                  </div>

                  <div style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    textAlign: 'center',
                    fontStyle: 'italic'
                  }}>
                    Analysis includes real-time news events, geopolitical factors, and company-specific developments
                  </div>
                </div>
              )}

	{/* Monte Carlo Results Display */}
              {monteCarloResults && (
                <div style={{
                  marginTop: '32px',
                  padding: '32px',
                  background: 'var(--surface-elevated)',
                  borderRadius: '12px',
                  border: '1px solid var(--border)'
                }}>
                  <h4 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    marginBottom: '16px',
                    color: 'var(--text-primary)'
                  }}>
                    🎲 Monte Carlo Simulation Results (10,000 Runs)
                  </h4>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '24px',
                    marginBottom: '32px'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        fontSize: '32px',
                        fontWeight: '700',
                        background: 'var(--gradient-success)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}>
                        ${monteCarloResults.projected_values?.mean?.toLocaleString()}
                      </div>
                      <div style={{
                        color: 'var(--text-secondary)',
                        fontSize: '14px'
                      }}>
                        Expected Value ({selectedTimeframe}Y)
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        fontSize: '32px',
                        fontWeight: '700',
                        color: monteCarloResults.risk_metrics?.probability_of_loss_pct < 10 ? 'var(--success)' : 'var(--warning)'
                      }}>
                        {monteCarloResults.risk_metrics?.probability_of_loss_pct}%
                      </div>
                      <div style={{
                        color: 'var(--text-secondary)',
                        fontSize: '14px'
                      }}>
                        Probability of Loss
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        fontSize: '32px',
                        fontWeight: '700',
                        background: 'var(--gradient-warm)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}>
                        ${monteCarloResults.risk_metrics?.value_at_risk_95?.toLocaleString()}
                      </div>
                      <div style={{
                        color: 'var(--text-secondary)',
                        fontSize: '14px'
                      }}>
                        95% VaR (Worst Case)
                      </div>
                    </div>
                  </div>
                  
                  <div style={{
                    padding: '24px',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    marginBottom: '16px'
                  }}>
                    <h5 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      marginBottom: '12px',
                      color: 'var(--text-primary)'
                    }}>
                      📊 Risk Analysis Summary:
                    </h5>
                    <div style={{
                      color: 'var(--text-secondary)',
                      fontSize: '14px',
                      lineHeight: '1.5'
                    }}>
                      After 10,000 simulations, your portfolio shows an {monteCarloResults.risk_metrics?.probability_of_loss_pct}% chance of loss with an average maximum drawdown of {Math.abs(monteCarloResults.risk_metrics?.avg_max_drawdown_pct)}%. 
                      The 95% Value at Risk indicates that in the worst 5% of scenarios, your portfolio value could drop to ${monteCarloResults.risk_metrics?.value_at_risk_95?.toLocaleString()}.
                    </div>
                  </div>

                  <div style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    textAlign: 'center',
                    fontStyle: 'italic'
                  }}>
                    Monte Carlo simulation based on {monteCarloResults.analysis_metadata?.data_period} using multivariate normal distribution
                  </div>
                </div>
              )}
	 

              {/* Enhanced 7-Benchmark Comparison Section */}
              {benchmarkData && (
                <div style={{
                  marginTop: '30px',
                  padding: '30px',
                  background: 'var(--surface-elevated)',
                  borderRadius: '20px',
                  border: '2px solid var(--border-accent)'
                }}>
                  <h2 style={{
                    background: 'var(--gradient-primary)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: '2rem',
                    textAlign: 'center',
                    marginBottom: '10px',
                    fontWeight: '700'
                  }}>
                    📊 Portfolio vs Market Benchmarks
                  </h2>
                  
                  <div style={{
                    textAlign: 'center',
                    fontSize: '0.9rem',
                    color: 'var(--text-muted)',
                    marginBottom: '25px',
                    fontStyle: 'italic'
                  }}>
                    AI-enhanced comparison across 7 market benchmarks with identical analysis methodology
                  </div>
                  
                  {/* Performance Summary Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '15px',
                    marginBottom: '30px'
                  }}>
                    {/* Portfolio Performance Card */}
                    <div style={{
                      padding: '20px',
                      background: 'var(--surface-accent)',
                      border: '2px solid var(--border-accent)',
                      borderRadius: '16px',
                      textAlign: 'center',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: 'var(--border-accent)',
                        color: 'var(--accent)',
                        padding: '3px 6px',
                        borderRadius: '8px',
                        fontSize: '0.6rem',
                        fontWeight: '700'
                      }}>
                        YOUR PORTFOLIO
                      </div>
                      <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🏆</div>
                      <div style={{
                        color: 'var(--accent)',
                        fontWeight: '700',
                        fontSize: '0.9rem',
                        marginBottom: '8px'
                      }}>
                        M7 Portfolio
                      </div>
                      <div style={{
                        fontSize: '1.5rem',
                        color: 'var(--text-primary)',
                        margin: '8px 0',
                        fontWeight: '700'
                      }}>
                        ${benchmarkData.portfolio_projection?.final_value?.toLocaleString()}
                      </div>
                      <div style={{
                        color: benchmarkData.portfolio_projection?.total_return_pct > 0 ? 'var(--success)' : 'var(--error)',
                        fontWeight: '700',
                        fontSize: '1rem',
                        marginBottom: '6px'
                      }}>
                        {benchmarkData.portfolio_projection?.total_return_pct > 0 ? '+' : ''}
                        {benchmarkData.portfolio_projection?.total_return_pct?.toFixed(1)}%
                      </div>
                      <div style={{
                        fontSize: '0.7rem',
                        color: 'var(--text-muted)'
                      }}>
                        AI: {benchmarkData.portfolio_projection?.ai_predicted_return?.toFixed(1)}% annually
                      </div>
                    </div>
                    
                    {/* Benchmark Cards */}
                    {Object.entries(benchmarkData.benchmark_projections || {}).slice(0, 3).map(([key, data]: [string, any]) => (
                      <div key={key} style={{
                        padding: '16px',
                        background: 'var(--surface)',
                        border: `2px solid ${data.color}30`,
                        borderRadius: '16px',
                        textAlign: 'center',
                        position: 'relative'
                      }}>
                        <div style={{
                          position: 'absolute',
                          top: '6px',
                          right: '6px',
                          background: `${data.color}15`,
                          color: data.color,
                          padding: '2px 4px',
                          borderRadius: '6px',
                          fontSize: '0.55rem',
                          fontWeight: '700'
                        }}>
                          {data.risk_level?.toUpperCase()}
                        </div>
                        <div style={{
                          fontSize: '1.5rem',
                          marginBottom: '6px'
                        }}>
                          {data.emoji}
                        </div>
                        <div style={{
                          color: data.color,
                          fontWeight: '700',
                          fontSize: '0.8rem',
                          marginBottom: '4px'
                        }}>
                          {key}
                        </div>
                        <div style={{
                          fontSize: '0.65rem',
                          color: 'var(--text-muted)',
                          marginBottom: '8px'
                        }}>
                          {data.category}
                        </div>
                        <div style={{
                          fontSize: '1.2rem',
                          color: 'var(--text-primary)',
                          margin: '6px 0',
                          fontWeight: '700'
                        }}>
                          ${data.final_value?.toLocaleString()}
                        </div>
                        <div style={{
                          color: data.total_return_pct > 0 ? 'var(--success)' : 'var(--error)',
                          fontWeight: '700',
                          fontSize: '0.9rem',
                          marginBottom: '4px'
                        }}>
                          {data.total_return_pct > 0 ? '+' : ''}
                          {data.total_return_pct?.toFixed(1)}%
                        </div>
                        <div style={{
                          fontSize: '0.6rem',
                          color: 'var(--text-muted)'
                        }}>
                          AI: {data.predicted_annual_return?.toFixed(1)}%/yr
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chart Visualization */}
                  <div style={{
                    height: '450px',
                    marginBottom: '30px',
                    background: 'var(--surface)',
                    borderRadius: '16px',
                    padding: '30px',
                    border: '1px solid var(--border)'
                  }}>
                    <h3 style={{
                      color: 'var(--accent)',
                      textAlign: 'center',
                      marginBottom: '8px',
                      fontSize: '1.4rem'
                    }}>
                      📈 AI-Predicted Performance Trajectory ({benchmarkData.timeframe} Years)
                    </h3>
                    <div style={{
                      textAlign: 'center',
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                      marginBottom: '20px'
                    }}>
                      Dynamic visualization optimized for {selectedTimeframe}-year investment horizon
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={benchmarkData.time_labels?.map((label: string, index: number) => {
                        const dataPoint: any = { time: label };
                        dataPoint.portfolio = benchmarkData.portfolio_projection?.values[index];
                        
                        Object.keys(benchmarkData.benchmark_projections || {}).forEach(ticker => {
                          dataPoint[ticker] = benchmarkData.benchmark_projections[ticker]?.values[index];
                        });
                        
                        return dataPoint;
                      })}>
                        <defs>
                          <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                          </linearGradient>
                          
                          {Object.entries(benchmarkData.benchmark_projections || {}).map(([ticker, data]: [string, any]) => (
                            <linearGradient key={`${ticker}Gradient`} id={`${ticker}Gradient`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={data.color} stopOpacity={0.25}/>
                              <stop offset="95%" stopColor={data.color} stopOpacity={0.05}/>
                            </linearGradient>
                          ))}
                        </defs>
                        
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
                        <XAxis 
                          dataKey="time" 
                          stroke="#64748b"
                          fontSize={selectedTimeframe === 1 ? 10 : selectedTimeframe === 3 ? 11 : 12}
                          fontWeight={600}
                          interval={selectedTimeframe === 1 ? 1 : 0}
                        />
                        <YAxis 
                          stroke="#64748b"
                          tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                          fontSize={11}
                          fontWeight={600}
                        />
                        <Tooltip 
                          contentStyle={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            borderRadius: '12px',
                            color: '#0f172a',
                            fontWeight: 600,
                            fontSize: '0.9rem'
                          }}
                          formatter={(value: any, name: string) => [
                            `${value?.toLocaleString()}`, 
                            name === 'portfolio' ? 'Your M7 Portfolio' : name
                          ]}
                          labelStyle={{ color: '#3b82f6', fontWeight: 700 }}
                        />
                    
                        
                        <Area 
                          type="monotone" 
                          dataKey="portfolio" 
                          stroke="#3b82f6" 
                          strokeWidth={4}
                          fill="url(#portfolioGradient)"
                          name="Your M7 Portfolio"
                          dot={{ fill: '#3b82f6', strokeWidth: 3, r: 5 }}
                          activeDot={{ r: 7, stroke: '#3b82f6', strokeWidth: 2, fill: '#3b82f6' }}
                        />
                        
                        {Object.entries(benchmarkData.benchmark_projections || {}).map(([ticker, data]: [string, any]) => (
                          <Area 
                            key={ticker}
                            type="monotone" 
                            dataKey={ticker} 
                            stroke={data.color} 
                            strokeWidth={3}
                            fill={`url(#${ticker}Gradient)`}
                            name={`${ticker} (${data.name})`}
                            dot={{ fill: data.color, strokeWidth: 2, r: 3 }}
                            activeDot={{ r: 5, stroke: data.color, strokeWidth: 2, fill: data.color }}
                          />
                        ))}
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Custom Legend Section */}
                  <div style={{
                    padding: '24px',
                    background: 'var(--surface-elevated)',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    marginBottom: '25px'
                  }}>
                    <h4 style={{
                      color: 'var(--accent)',
                      marginBottom: '16px',
                      fontSize: '1.1rem',
                      textAlign: 'center'
                    }}>
                      📊 Investment Options Comparison
                    </h4>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '12px'
                    }}>
                      {/* Your Portfolio */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        background: 'var(--surface)',
                        borderRadius: '8px',
                        border: '2px solid var(--accent)'
                      }}>
                        <div style={{
                          width: '16px',
                          height: '4px',
                          background: 'var(--accent)',
                          borderRadius: '2px'
                        }} />
                        <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                          Your M7 Portfolio
                        </span>
                      </div>
                      
                      {/* Benchmark Items */}
                      {Object.entries(benchmarkData.benchmark_projections || {}).map(([ticker, data]: [string, any]) => (
                        <div key={ticker} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          background: 'var(--surface)',
                          borderRadius: '8px',
                          border: `1px solid ${data.color}30`
                        }}>
                          <div style={{
                            width: '16px',
                            height: '4px',
                            background: data.color,
                            borderRadius: '2px'
                          }} />
                          <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                            {ticker} ({data.name})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Performance Analytics */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '20px',
                    marginBottom: '25px'
                  }}>
                    <div style={{
                      padding: '20px',
                      background: 'var(--surface-accent)',
                      borderRadius: '12px',
                      border: '1px solid var(--border-accent)'
                    }}>
                      <h4 style={{
                        color: 'var(--accent)',
                        marginBottom: '12px',
                        fontSize: '1.1rem'
                      }}>
                        🎯 Performance Ranking & Analysis
                      </h4>
                      <div style={{
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem',
                        lineHeight: '1.5'
                      }}>
                        Your portfolio: <strong style={{ color: 'var(--accent)' }}>
                          {benchmarkData.comparison_summary?.portfolio_rank}
                        </strong><br/>
                        Outperforming: <strong style={{ color: 'var(--success)' }}>
                          {benchmarkData.comparison_summary?.outperforming_count} out of {benchmarkData.comparison_summary?.total_benchmarks} benchmarks
                        </strong><br/>
                        Best benchmark: <strong style={{ color: 'var(--warning)' }}>
                          {benchmarkData.comparison_summary?.best_benchmark}
                        </strong>
                      </div>
                    </div>

                    <div style={{
                      padding: '20px',
                      background: 'var(--surface-emerald)',
                      borderRadius: '12px',
                      border: '1px solid rgba(16, 185, 129, 0.3)'
                    }}>
                      <h4 style={{
                        color: 'var(--success)',
                        marginBottom: '12px',
                        fontSize: '1.1rem'
                      }}>
                        🧠 Enhanced AI Methodology
                      </h4>
                      <div style={{
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem',
                        lineHeight: '1.5'
                      }}>
                        {benchmarkData.methodology}<br/>
                        <strong style={{ color: 'var(--success)' }}>
                          Coverage: {benchmarkData.enhanced_features?.risk_diversity}
                        </strong><br/>
                        <strong style={{ color: 'var(--accent)' }}>
                          {benchmarkData.data_consistency}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    textAlign: 'center',
                    padding: '20px',
                    background: 'var(--surface)',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    fontSize: '0.9rem',
                    color: 'var(--text-muted)'
                  }}>
                    <div style={{
                      marginBottom: '8px',
                      fontWeight: '600',
                      color: 'var(--accent)'
                    }}>
                      💡 Enhanced Investment Intelligence
                    </div>
                    This analysis uses identical AI methodology for your portfolio and all 7 market benchmarks, 
                    covering {Object.keys(benchmarkData.benchmark_projections || {}).length} different asset classes from low-risk blue chips to high-growth emerging markets.
                    Dynamic visualization optimized for your {selectedTimeframe}-year investment timeline.
                    <div style={{
                      marginTop: '8px',
                      fontSize: '0.8rem',
                      fontStyle: 'italic'
                    }}>
                      Past performance does not guarantee future results. This is for educational purposes only.
                    </div>
                  </div>
                </div>
              )}

            </StepSection>
          </div>
        </div>
      </section>

  {/* Footer */}
<footer style={{
  background: 'var(--bg2)',
  borderTop: '1px solid rgba(255,255,255,0.08)',
  padding: '40px 32px',
  textAlign: 'center',
  color: 'var(--text-muted)',
  fontSize: '14px'
}}>
  <div style={{
    fontWeight: '700',
    fontSize: '16px',
    marginBottom: '8px'
  }}>
    Project developed by{' '}
    <a 
      href="https://www.linkedin.com/in/riya-pradhan/" 
      target="_blank" 
      rel="noopener noreferrer"
      style={{
        color: '#1e3a8a',
        textDecoration: 'none',
        borderBottom: '1px solid transparent',
        transition: 'all 0.2s ease'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.borderBottom = '1px solid #3b82f6';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.borderBottom = '1px solid transparent';
      }}
    >
      Riya Pradhan
    </a>
    {', Undergraduate Student at the University of Toronto'}
  </div>
  <div style={{
    fontSize: '14px',
    color: 'var(--text-muted)'
  }}>
    Quantitative Finance & Financial Economics | Self-Directed Learning Initiative
  </div>
</footer>
    </div>
  );
};

export default Portfolio;
