import os
from anthropic import Anthropic
from dotenv import load_dotenv
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import yfinance as yf
import pandas as pd
import numpy as np
import json
import requests
from datetime import datetime, timedelta
import re
from alpha_vantage.timeseries import TimeSeries
from alpha_vantage.fundamentaldata import FundamentalData

# Load environment variables and create Claude client
load_dotenv()
client = Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))

# Create Flask app
app = Flask(__name__)
CORS(app)

@app.after_request
def after_request(response):
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response

@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        return response

# Add this at the top of your app.py after imports
analysis_cache = {}

@app.route('/api/portfolio/enhanced-predictions-fixed', methods=['POST'])
def enhanced_predictions_fixed():
    """FIXED: Main analysis endpoint now uses unified analysis"""
    try:
        data = request.json
        weights = data.get('weights', {})
        investment_amount = data.get('amount', 10000)
        selected_years = data.get('selected_years', 3)
        risk_profile = data.get('risk_profile', 'moderate')
        
        if not weights:
            return jsonify({'status': 'error', 'message': 'Portfolio weights required'}), 400
        
        print(f"🔧 FIXED Enhanced Predictions Request: {weights}")
        
        # Create cache key
        cache_key = f"{str(sorted(weights.items()))}_{investment_amount}_{selected_years}_{risk_profile}"
        
        # Use the unified analysis
        unified_result = get_unified_portfolio_analysis(
            weights, investment_amount, risk_profile, selected_years
        )
        
        # Cache the result
        analysis_cache[cache_key] = unified_result
        
        return jsonify({
            'status': 'success',
            'enhanced_predictions': unified_result,
            'cache_key': cache_key,
            'message': 'FIXED: Enhanced predictions use unified analysis for consistency'
        })
        
    except Exception as e:
        print(f"❌ Fixed enhanced predictions error: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/portfolio/benchmark-comparison-fixed', methods=['POST'])
def benchmark_comparison_fixed():
    """FIXED: Uses unified analysis to ensure consistency"""
    try:
        data = request.json
        weights = data.get('weights', {})
        investment_amount = data.get('amount', 10000)
        years = data.get('years', 3)
        risk_profile = data.get('risk_profile', 'moderate')
        
        if not weights:
            return jsonify({'status': 'error', 'message': 'Portfolio weights required'}), 400
        
        print(f"🔧 FIXED Benchmark Comparison Request: {weights}")
        
        # Create cache key
        cache_key = f"{str(sorted(weights.items()))}_{investment_amount}_{years}_{risk_profile}"
        
        # Check if we have existing analysis
        existing_analysis = analysis_cache.get(cache_key)
        
        if existing_analysis:
            print("🎯 Using cached analysis for perfect consistency!")
        
        # Use the fixed benchmark comparison with existing analysis
        comparison_result = ai_enhanced_benchmark_comparison(
            weights, investment_amount, years, risk_profile, existing_analysis
        )
        
        return jsonify({
            'status': 'success',
            'comparison_data': comparison_result,
            'message': 'FIXED: Benchmark comparison uses identical analysis as main feature'
        })
        
    except Exception as e:
        print(f"❌ Fixed benchmark endpoint error: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

# Magnificent 7 stocks
MAGNIFICENT_7 = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NVDA', 'TSLA']

# ENHANCED: 7 Comprehensive Benchmarks with Rich Metadata
BENCHMARK_TICKERS = {
    'SPY': {
        'name': 'S&P 500',
        'description': 'Broad US market benchmark',
        'color': '#1e40af',
        'gradient': 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)',
        'category': 'US Broad Market',
        'emoji': '🇺🇸',
        'risk_level': 'Medium'
    },
    'QQQ': {
        'name': 'Nasdaq-100',
        'description': 'Technology-focused index',
        'color': '#7c3aed',
        'gradient': 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
        'category': 'US Tech',
        'emoji': '💻',
        'risk_level': 'High'
    },
    'DIA': {
        'name': 'Dow Jones',
        'description': 'Blue-chip companies',
        'color': '#0891b2',
        'gradient': 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
        'category': 'US Blue Chip',
        'emoji': '🏭',
        'risk_level': 'Low'
    },
    'VGT': {
        'name': 'Technology Sector',
        'description': 'Direct tech comparison',
        'color': '#dc2626',
        'gradient': 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
        'category': 'Tech Sector',
        'emoji': '🚀',
        'risk_level': 'High'
    },
    'IWM': {
        'name': 'Russell 2000',
        'description': 'Small cap growth alternative',
        'color': '#ea580c',
        'gradient': 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
        'category': 'US Small Cap',
        'emoji': '🎯',
        'risk_level': 'Very High'
    },
    'VEA': {
        'name': 'International Developed',
        'description': 'Geographic diversification',
        'color': '#16a34a',
        'gradient': 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
        'category': 'International',
        'emoji': '🌍',
        'risk_level': 'Medium'
    },
    'VWO': {
        'name': 'Emerging Markets',
        'description': 'High growth alternative',
        'color': '#ca8a04',
        'gradient': 'linear-gradient(135deg, #ca8a04 0%, #a16207 100%)',
        'category': 'Emerging Markets',
        'emoji': '🌏',
        'risk_level': 'Very High'
    }
}

def get_comprehensive_current_events():
    """
    Get BROAD current events and let Claude determine what's important
    No predefined keywords - let the AI analyze what's truly market-moving
    """
    try:
        NEWS_API_KEY = os.getenv('NEWS_API_KEY', 'your_news_api_key_here')
        base_url = "https://newsapi.org/v2/top-headlines"
        
        # Calculate date range (last 5 days for most current)
        end_date = datetime.now()
        start_date = end_date - timedelta(days=5)
        
        all_news = []
        
        print(f"🔍 Fetching comprehensive current events for Claude analysis...")
        
        # Get top headlines from MULTIPLE comprehensive sources
        news_sources = [
            # Business & Financial News
            {'category': 'business', 'country': 'us', 'description': 'US Business News'},
            {'category': 'business', 'country': 'gb', 'description': 'UK Business News'},
            
            # Technology News  
            {'category': 'technology', 'country': 'us', 'description': 'US Technology News'},
            
            # General News (captures political, economic, global events)
            {'category': 'general', 'country': 'us', 'description': 'US General News'},
            
            # No category filter - just top headlines
            {'country': 'us', 'description': 'Top US Headlines'},
        ]
        
        for source_config in news_sources:
            try:
                params = {
                    'apiKey': NEWS_API_KEY,
                    'language': 'en',
                    'pageSize': 20,  # Get more articles per source
                    'sortBy': 'publishedAt'
                }
                
                # Add the source configuration
                params.update(source_config)
                
                response = requests.get(base_url, params=params, timeout=15)
                
                if response.status_code == 200:
                    data = response.json()
                    articles = data.get('articles', [])
                    
                    for article in articles:
                        if (article.get('title') and 
                            article.get('description') and 
                            len(article['description']) > 50):  # Filter out short descriptions
                            
                            all_news.append({
                                'title': article['title'],
                                'description': article['description'],
                                'source': article.get('source', {}).get('name', 'Unknown'),
                                'published_at': article.get('publishedAt', ''),
                                'url': article.get('url', ''),
                                'source_category': source_config['description']
                            })
                    
                    print(f"✅ Retrieved {len(articles)} articles from {source_config['description']}")
                else:
                    print(f"⚠️ Error from {source_config['description']}: {response.status_code}")
                    
            except Exception as e:
                print(f"❌ Error fetching {source_config.get('description', 'news')}: {e}")
                continue
        
        # Remove duplicates based on title similarity
        seen_titles = set()
        unique_news = []
        
        for article in all_news:
            # Create a simple key for duplicate detection (first 60 characters)
            title_key = article['title'].lower()[:60]
            if title_key not in seen_titles:
                seen_titles.add(title_key)
                unique_news.append(article)
        
        # Sort by recency
        unique_news.sort(key=lambda x: x['published_at'], reverse=True)
        
        # Filter suspicious news that causes hallucinations
        filtered_news = []
        suspicious_keywords = [
            'biden administration', 'biden admin', 'trump 2020', 'covid lockdown',
            'inflation 300%', 'inflation 320%', 'inflation 250%',
            'pandemic restrictions', '2020 election', '2021 stimulus'
        ]
        
        for article in unique_news:
            title = article.get('title', '').lower()
            description = article.get('description', '').lower()
            
            # Skip suspicious content
            if any(keyword in title or keyword in description for keyword in suspicious_keywords):
                print(f"🚫 FILTERING suspicious news: {article.get('title', '')[:50]}...")
                continue
            
            # Only include 2024-2025 content
            if article.get('published_at'):
                try:
                    pub_date = datetime.fromisoformat(article['published_at'].replace('Z', '+00:00'))
                    if pub_date.year < 2024:
                        continue
                except:
                    pass
            
            filtered_news.append(article)
        
        print(f"📰 Retrieved {len(filtered_news)} filtered current events for Claude analysis")
        
        # Let Claude analyze what's important rather than us pre-filtering
        return {
            'all_current_events': filtered_news[:50],  # Top 50 most recent filtered events
            'fetch_timestamp': datetime.now().isoformat(),
            'date_range': f"{start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}",
            'sources_analyzed': [config['description'] for config in news_sources],
            'total_articles': len(unique_news),
            'methodology': 'Comprehensive news collection for AI analysis - no pre-filtering'
        }
        
    except Exception as e:
        print(f"❌ Comprehensive news fetch error: {e}")
        return {
            'all_current_events': [],
            'error': f'News API unavailable: {e}',
            'fallback_message': 'Using economic data only'
        }

def get_fed_economic_data():
    """
    Fetch key economic indicators from Federal Reserve Economic Data (FRED)
    This provides real-time economic intelligence for portfolio analysis
    """
    try:
        # FRED API key (free registration required)
        FRED_API_KEY = os.getenv('FRED_API_KEY', 'your_fred_api_key_here')
        
        base_url = "https://api.stlouisfed.org/fred/series/observations"
        
        # Key economic indicators that affect tech stocks
        indicators = {
            'fed_funds_rate': 'FEDFUNDS',           # Federal Funds Rate
            'inflation_rate': 'CPIAUCSL',          # Consumer Price Index (Inflation)
            'unemployment': 'UNRATE',              # Unemployment Rate
            'gdp_growth': 'GDP',                   # Gross Domestic Product
            'treasury_10yr': 'GS10',              # 10-Year Treasury Rate
            'consumer_sentiment': 'UMCSENT'        # Consumer Sentiment Index
        }
        
        economic_data = {}
        
        for indicator_name, series_id in indicators.items():
            try:
                # Get most recent data point
                params = {
                    'series_id': series_id,
                    'api_key': FRED_API_KEY,
                    'file_type': 'json',
                    'limit': '12',  # Get last 12 data points for trend analysis
                    'sort_order': 'desc'  # Most recent first
                }
                
                response = requests.get(base_url, params=params, timeout=10)
                
                if response.status_code == 200:
                    data = response.json()
                    observations = data.get('observations', [])
                    
                    if observations:
                        # Get the most recent valid data point
                        for obs in observations:
                            if obs['value'] != '.' and obs['value'] is not None:
                                economic_data[indicator_name] = {
                                    'value': float(obs['value']),
                                    'date': obs['date'],
                                    'series_id': series_id
                                }
                                break
                        
                        # Calculate trend (comparing recent vs 6 months ago)
                        if len(observations) >= 6:
                            try:
                                recent_val = float(observations[0]['value']) if observations[0]['value'] != '.' else None
                                older_val = float(observations[5]['value']) if observations[5]['value'] != '.' else None
                                
                                if recent_val and older_val:
                                    trend = "Rising" if recent_val > older_val else "Falling" if recent_val < older_val else "Stable"
                                    economic_data[indicator_name]['trend'] = trend
                                    economic_data[indicator_name]['change_6m'] = round(recent_val - older_val, 2)
                            except (ValueError, IndexError):
                                economic_data[indicator_name]['trend'] = "Unknown"
                
                else:
                    print(f"⚠️ FRED API error for {indicator_name}: {response.status_code}")
                    
            except Exception as e:
                print(f"❌ Error fetching {indicator_name}: {e}")
                continue
	
		 # ADD THIS VALIDATION CODE RIGHT HERE (before the print and return):
        # Validate economic data to prevent hallucinations
        validated_data = {}
        for indicator, data in economic_data.items():
            if isinstance(data, dict) and 'value' in data:
                value = data['value']
                
                # Sanity checks
                if indicator == 'inflation_rate' and (value > 50 or value < -10):
                    print(f"🚫 REJECTING invalid inflation: {value}%")
                    validated_data[indicator] = {'value': 3.2, 'trend': 'Stable', 'source': 'validated_fallback'}
                elif indicator == 'fed_funds_rate' and (value > 20 or value < 0):
                    print(f"🚫 REJECTING invalid fed rate: {value}%")
                    validated_data[indicator] = {'value': 5.25, 'trend': 'Stable', 'source': 'validated_fallback'}
                elif indicator == 'unemployment' and (value > 50 or value < 0):
                    print(f"🚫 REJECTING invalid unemployment: {value}%")
                    validated_data[indicator] = {'value': 3.9, 'trend': 'Stable', 'source': 'validated_fallback'}
                else:
                    validated_data[indicator] = data
            else:
                validated_data[indicator] = data
        
        print(f"✅ Successfully fetched {len(validated_data)} economic indicators from FRED")
        return validated_data  # CHANGE THIS LINE from 'economic_data' to 'validated_data'
        
    except Exception as e:
        print(f"❌ FRED API integration error: {e}")
        # Return fallback data structure
        return {
            'fed_funds_rate': {'value': 5.25, 'date': '2024-12-01', 'trend': 'Stable'},
            'inflation_rate': {'value': 3.2, 'date': '2024-11-01', 'trend': 'Falling'},
            'unemployment': {'value': 3.9, 'date': '2024-11-01', 'trend': 'Stable'},
            'error': f'FRED API unavailable: {e}'
        }
		

def enhanced_market_synthesis_with_comprehensive_news(portfolio_weights, investment_amount, risk_profile, selected_years=3):
    """
    ENHANCED: Let Claude analyze ALL current events and determine what's truly important
    No predefined assumptions about what matters - let AI decide
    """
    try:
        print(f"🧠 Comprehensive AI analysis for ${investment_amount:,} portfolio")
        
        # Get current economic data
        economic_data = get_fed_economic_data()
        
        # Get COMPREHENSIVE current events (no pre-filtering)
        current_events = get_comprehensive_current_events()
        
        # Build portfolio context
        portfolio_text = ', '.join([f'{stock}: {weight*100:.1f}%' for stock, weight in portfolio_weights.items()])
        
        # Date calculations
        current_date = datetime.now()
        target_date = current_date + timedelta(days=365 * selected_years)
        current_date_str = current_date.strftime("%B %Y")
        target_date_str = target_date.strftime("%B %Y")
        
        # Build current market context
        fed_rate = economic_data.get('fed_funds_rate', {}).get('value', 'N/A')
        inflation = economic_data.get('inflation_rate', {}).get('value', 'N/A')
        fed_trend = economic_data.get('fed_funds_rate', {}).get('trend', 'Stable')
        
        # Format ALL news for Claude to analyze (no pre-filtering)
        comprehensive_news = ""
        if current_events.get('all_current_events'):
            comprehensive_news = "COMPREHENSIVE CURRENT EVENTS (Last 5 Days):\n"
            for i, event in enumerate(current_events['all_current_events'][:30], 1):
                comprehensive_news += f"{i}. {event['title']}\n"
                comprehensive_news += f"   Details: {event['description'][:150]}...\n"
                comprehensive_news += f"   Source: {event['source']} | Category: {event['source_category']}\n\n"
        
        # ULTRA-SPECIFIC ANALYSIS PROMPT - Force Claude to be extremely detailed
        comprehensive_prompt = f"""You are a senior Wall Street analyst providing critical portfolio predictions for a client investing ${investment_amount:,} of their personal wealth.

PORTFOLIO DETAILS:
Investment Amount: ${investment_amount:,}
Current Allocation: {portfolio_text}
Risk Profile: {risk_profile} investor
Analysis Date: {current_date_str}
Investment Timeframe: {selected_years} years (target: {target_date_str})

CURRENT ECONOMIC BASELINE:
Federal Reserve: {fed_rate}% funds rate, {fed_trend} trend
Inflation Rate: {inflation}% and trending {economic_data.get('inflation_rate', {}).get('trend', 'stable')}

CRITICAL ANTI-HALLUCINATION RULES - YOU MUST FOLLOW:
1. NEVER mention inflation above 10% - it is currently around 3-4%
2. NEVER reference Biden administration - Trump is president since Jan 2025
3. NEVER mention COVID, lockdowns, or 2020-2022 events
4. ONLY use the economic data provided above
5. Base analysis on 2024-2025 market conditions ONLY

{comprehensive_news}

CRITICAL ANALYSIS REQUIREMENTS:
You MUST identify the 3-4 most specific, recent events from the news above and provide EXACT impact analysis.

DO NOT be generic. Instead of saying "Federal Reserve policy" reference "current Fed policy stance" or "recent Federal Reserve communications." Use general market trends rather than fabricating specific events with exact dates and numbers.

ULTRA-SPECIFIC FORMAT REQUIRED:
"Based on [EXACT EVENT with specific details], [EXACT EVENT with specific details], and [EXACT EVENT with specific details], your ${investment_amount:,} portfolio has [X]% probability of reaching $[specific amount] in {selected_years} year{'s' if selected_years != 1 else ''}."

COMPANY-SPECIFIC ANALYSIS (REQUIRED):
For each company in the portfolio, provide realistic analysis based on:
- Recent earnings and financial performance
- Current market position and competitive advantages  
- Relevant industry trends affecting the technology sector
- Economic factors (interest rates, inflation) that impact tech stocks

AVOID: Making forced connections between unrelated news events and specific companies.
FOCUS: On logical, realistic factors that actually affect these technology companies.

EXAMPLE OF REQUIRED SPECIFICITY:
EXAMPLE OF REQUIRED SPECIFICITY:
EXAMPLE FORMAT:
"Based on current Federal Reserve policy, technology sector earnings trends, and market conditions, your ${investment_amount:,} portfolio has X% probability of reaching $[amount] in {selected_years} years.

Company Analysis:
- AAPL: Recent iPhone sales and Services growth indicate...
- MSFT: Azure cloud growth and enterprise adoption suggest...
- etc."

Current Market Analysis:
- Focus on recent earnings, current market conditions, and 2024-2025 developments
- Reference only contemporary events and current economic indicators

Specific Company Impacts:
- NVIDIA: Export restrictions will reduce FY2025 revenue by $3.1B (-12% impact), but AI datacenter growth of 45% will offset $2.8B, resulting in net -$300M impact
- Apple: Foxconn disruption costs $127 per iPhone in additional logistics, reducing Q4 margins by 2.3%, but Services growth of 8.2% adds $1.4B revenue
- Microsoft: Azure's 42% growth rate vs 35% expected adds $600M quarterly revenue, with enterprise AI adoption accelerating by 23%"

YOUR SPECIFIC ANALYSIS REQUIREMENTS:

MAIN PREDICTION FORMAT:
"Based on [SPECIFIC EVENT 1 with exact details and numbers], [SPECIFIC EVENT 2 with exact details and numbers], and [SPECIFIC EVENT 3 with exact details and numbers], your ${investment_amount:,} portfolio has [X]% probability of reaching $[exact amount] in {selected_years} year{'s' if selected_years != 1 else ''}."

QUANTIFIED COMPANY IMPACT (REQUIRED FOR EACH STOCK):
{' '.join([f'''
- {stock}: [Specific event impact] will [increase/decrease] [specific metric] by [exact amount/percentage], resulting in [dollar impact] to company valuation over {selected_years} years''' for stock in portfolio_weights.keys()])}

SCENARIO ANALYSIS WITH SPECIFIC TRIGGERS:
- Bull Case ($[amount]): If [specific positive development with details] occurs
- Base Case ($[amount]): Given current trajectory of [specific ongoing situation]  
- Bear Case ($[amount]): If [specific negative escalation with details] happens

RISK FACTORS WITH SPECIFIC TRIGGERS:
"However, if [specific escalation - be exact about what could happen], [specific company] could see [exact impact amount] due to [specific mechanism]."

CRITICAL REQUIREMENTS - YOU MUST:
1. Reference events from the provided news and economic data
2. Base analysis on the actual data provided, not fabricated details
3. If specific numbers aren't in the data, use ranges or general estimates
4. Clearly distinguish between confirmed data and projections
5. Use phrases like "based on recent trends" rather than inventing specific dates
6. Focus on logical analysis rather than precise but fabricated numbers

CRITICAL INSTRUCTION: Only reference recent events from 2024-2025. Do not mention COVID-19, lockdowns, or other outdated events from 2020-2022. Focus on current market conditions, recent earnings, and contemporary economic factors.

ANALYSIS SCOPE: Focus on comprehensive factors affecting the technology sector including:
- Geopolitical events and international tensions affecting global markets
- Supply chain disruptions and manufacturing challenges  
- Economic policy impacts (US and international)
- Technology sector fundamentals (AI developments, chip supply, cybersecurity, cloud growth)
- Global trade dynamics and currency effects
- Interest rates and monetary policy impacts on tech valuations
- Current earnings trends, valuations, and market sentiment
- Consumer and enterprise technology spending patterns
- Regulatory environment changes affecting tech companies
Current US President: Donald Trump (since January 2025) - reference when relevant to policy impacts.

REMEMBER: This investor is making real financial decisions with ${investment_amount:,}. They need specific, actionable analysis based on actual current events, not broad market commentary. Donald Trump has been president since January 2025. Focus on realistic analysis using verified data only.

Analyze the specific news events above and provide professional, detailed, quantified predictions."""
        
        print(f"🎯 Claude analyzing comprehensive market intelligence...")
        
        response = client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=2500,  # Increased for comprehensive analysis
            messages=[{"role": "user", "content": comprehensive_prompt}]
        )
        
        # ADD RESPONSE VALIDATION HERE:
        raw_analysis = response.content[0].text
        
        # Validate Claude's response for hallucinations
        validated_analysis = raw_analysis
        
        # Check for unrealistic inflation mentions
        import re
        inflation_matches = re.findall(r'inflation.*?(\d+(?:\.\d+)?)%', validated_analysis.lower())
        for match in inflation_matches:
            if float(match) > 15:
                print(f"🚫 HALLUCINATION DETECTED: Inflation {match}%")
                validated_analysis = validated_analysis.replace(f"{match}%", "3.2%")
        
        # Check for Biden mentions (Trump is president since Jan 2025)
        if 'biden' in validated_analysis.lower():
            print(f"🚫 POLITICAL HALLUCINATION: Biden mentioned")
            validated_analysis = validated_analysis.replace('Biden', 'Trump').replace('biden', 'Trump')
        
        comprehensive_analysis = validated_analysis
        print(f"✅ Comprehensive market analysis complete")
        
        return {
            'specific_predictions': comprehensive_analysis,
            'news_events_analyzed': len(current_events.get('all_current_events', [])),
            'investment_amount': investment_amount,
            'portfolio_allocation': portfolio_weights,
            'timeframe': f"{selected_years} year{'s' if selected_years != 1 else ''}",
            'target_date': target_date_str,
            'analysis_date': current_date_str,
            'market_context': {
                'fed_funds_rate': f"{fed_rate}% ({fed_trend})",
                'inflation_rate': f"{inflation}%",
                'events_analyzed': len(current_events.get('all_current_events', [])),
                'analysis_date': current_date_str
            },
            'methodology': f'Comprehensive AI analysis of {len(current_events.get("all_current_events", []))} current events',
            'confidence_level': 'High - Based on comprehensive real-time analysis',
            'data_sources': current_events.get('sources_analyzed', [])
        }
        
    except Exception as e:
        print(f"❌ Comprehensive analysis error: {e}")
        return {
            'specific_predictions': f'Comprehensive analysis temporarily unavailable: {e}. Your ${investment_amount:,} allocation shows technology sector exposure appropriate for {risk_profile} investors.',
            'error': str(e)
        }

def ai_benchmark_analysis_unified(benchmark_ticker, investment_amount, selected_years, risk_profile):
    """FIXED: Use IDENTICAL methodology for benchmark analysis"""
    try:
        print(f"🤖 UNIFIED AI analyzing {benchmark_ticker} benchmark using IDENTICAL methodology...")
        
        benchmark_weights = {benchmark_ticker: 1.0}
        
        benchmark_info = BENCHMARK_TICKERS.get(benchmark_ticker, {
            'name': benchmark_ticker,
            'description': f'{benchmark_ticker} index',
            'category': 'Unknown'
        })
        
        # Use the unified analysis function
        benchmark_analysis_result = get_unified_portfolio_analysis(
            benchmark_weights, investment_amount, risk_profile, selected_years
        )
        
        original_prediction = benchmark_analysis_result.get('analysis_text', '')
        
        adapted_prediction = original_prediction.replace(
            f"your ${investment_amount:,} portfolio", 
            f"a ${investment_amount:,} investment in {benchmark_info['name']} ({benchmark_ticker})"
        ).replace(
            "portfolio", 
            f"{benchmark_info['name']} investment"
        )
        
        print(f"✅ UNIFIED benchmark analysis complete for {benchmark_ticker}")
        
        predicted_dollar_value = extract_unified_dollar_prediction(
   		 benchmark_analysis_result.get('analysis_text', ''), investment_amount
	)
        
        return {
            'ai_analysis': adapted_prediction,
            'predicted_dollar_value': predicted_dollar_value,
            'benchmark_name': benchmark_info['name'],
            'benchmark_category': benchmark_info['category'],
            'risk_level': benchmark_info.get('risk_level', 'Medium'),
            'methodology': 'IDENTICAL to portfolio: Claude + FRED + Comprehensive News',
            'unified_analysis': True,
            'same_market_intelligence': True
        }
        
    except Exception as e:
        print(f"❌ UNIFIED benchmark analysis error for {benchmark_ticker}: {e}")
        fallback_multipliers = {
            'SPY': 1.35, 'QQQ': 1.40, 'DIA': 1.30, 'VGT': 1.45,
            'IWM': 1.38, 'VEA': 1.28, 'VWO': 1.32
        }
        fallback_value = investment_amount * fallback_multipliers.get(benchmark_ticker, 1.33)
        
        return {
            'ai_analysis': f'UNIFIED analysis temporarily unavailable for {benchmark_ticker}. Using market data.',
            'predicted_dollar_value': fallback_value,
            'benchmark_name': benchmark_info['name'],
            'benchmark_category': benchmark_info['category'],
            'risk_level': benchmark_info.get('risk_level', 'Medium'),
            'methodology': 'Fallback estimate'
        }

# UPDATED: Use unified methodology for ALL 7 benchmarks
def ai_enhanced_benchmark_comparison(portfolio_weights, investment_amount, years, risk_profile, existing_analysis=None):

    """FIXED: Use IDENTICAL AI methodology for both portfolio and ALL 7 benchmarks"""
    try:
        print(f"🔥 FIXED AI-Enhanced 7-Benchmark Comparison: ${investment_amount:,} over {years} years")
        
        # STEP 1: Use existing analysis if provided, otherwise get new one
        if existing_analysis:
            print("🧠 Using existing UNIFIED AI portfolio analysis...")
            portfolio_unified_analysis = existing_analysis
        else:
            print("🧠 Getting UNIFIED AI portfolio analysis...")
            portfolio_unified_analysis = get_unified_portfolio_analysis(
                portfolio_weights, investment_amount, risk_profile, years
            )
        
        # STEP 2: Use the EXACT dollar prediction from unified analysis
        portfolio_predicted_value = portfolio_unified_analysis['predicted_dollar_value']
        
        print(f"✅ FIXED: Portfolio predicted value: ${portfolio_predicted_value:,.0f}")
	

      # STEP 3: Get UNIFIED AI analysis for ALL 7 benchmarks using IDENTICAL methodology
        benchmark_analyses = {}
        for ticker, info in BENCHMARK_TICKERS.items():
            print(f"🤖 UNIFIED AI analyzing {ticker} ({info['name']}) using IDENTICAL methodology...")
            benchmark_analysis = ai_benchmark_analysis_unified(ticker, investment_amount, years, risk_profile)
            benchmark_analyses[ticker] = {
                'name': info['name'],
                'color': info['color'],
                'gradient': info['gradient'],
                'category': info['category'],
                'emoji': info['emoji'],
                'risk_level': info['risk_level'],
                'ai_analysis': benchmark_analysis['ai_analysis'],
                'predicted_dollar_value': benchmark_analysis['predicted_dollar_value']
            }
        
        # STEP 4: Generate time points for visualization based on selected years
        months = years * 12
        time_points = []
        
        # Dynamic time points based on timeframe
        if years == 1:
            # Monthly for 1 year
            for month in range(0, months + 1, 2):  # Every 2 months
                if month == 0:
                    time_points.append("Start")
                elif month == months:
                    time_points.append("1 Year")
                else:
                    time_points.append(f"{month}M")
        elif years == 3:
            # Every 6 months for 3 years
            for month in range(0, months + 1, 6):
                if month == 0:
                    time_points.append("Start")
                elif month % 12 == 0:
                    time_points.append(f"Year {month // 12}")
                else:
                    time_points.append(f"{month // 12}.5Y")
        else:  # 5 years
            # Yearly for 5 years
            for year in range(years + 1):
                if year == 0:
                    time_points.append("Start")
                else:
                    time_points.append(f"Year {year}")
        
       # STEP 5: Generate portfolio projections using UNIFIED dollar prediction
        portfolio_final_value = portfolio_predicted_value
        portfolio_growth_rate = (portfolio_final_value / investment_amount) ** (1/years) - 1
        portfolio_monthly_return = (1 + portfolio_growth_rate) ** (1/12) - 1
        
        portfolio_values = [investment_amount]
        for month in range(1, months + 1):
            new_value = portfolio_values[-1] * (1 + portfolio_monthly_return)
            portfolio_values.append(new_value)
        
        # Ensure final value matches unified prediction exactly
        portfolio_values[-1] = portfolio_final_value
        
        # Sample values for chart based on timeframe
        if years == 1:
            portfolio_chart_values = [portfolio_values[i] for i in range(0, len(portfolio_values), 2)]
        elif years == 3:
            portfolio_chart_values = [portfolio_values[i] for i in range(0, len(portfolio_values), 6)]
        else:  # 5 years
            portfolio_chart_values = [portfolio_values[i] for i in range(0, len(portfolio_values), 12)]
        
      # STEP 6: Generate benchmark projections using UNIFIED dollar predictions
        benchmark_projections = {}
        for ticker, data in benchmark_analyses.items():
            # Use UNIFIED dollar prediction for this benchmark
            benchmark_final_value = data['predicted_dollar_value']
            benchmark_growth_rate = (benchmark_final_value / investment_amount) ** (1/years) - 1
            monthly_return = (1 + benchmark_growth_rate) ** (1/12) - 1
            
            values = [investment_amount]
            for month in range(1, months + 1):
                new_value = values[-1] * (1 + monthly_return)
                values.append(new_value)
            
            # Ensure final value matches unified prediction exactly
            values[-1] = benchmark_final_value
            
            # Sample values for chart based on timeframe
            if years == 1:
                chart_values = [values[i] for i in range(0, len(values), 2)]
            elif years == 3:
                chart_values = [values[i] for i in range(0, len(values), 6)]
            else:
                chart_values = [values[i] for i in range(0, len(values), 12)]
            
            benchmark_projections[ticker] = {
                'name': data['name'],
                'color': data['color'],
                'gradient': data['gradient'],
                'category': data['category'],
                'emoji': data['emoji'],
                'risk_level': data['risk_level'],
                'values': chart_values,
                'final_value': benchmark_final_value,
                'total_return_pct': ((benchmark_final_value - investment_amount) / investment_amount) * 100,
                'ai_analysis': data['ai_analysis'],
                'predicted_annual_return': ((benchmark_final_value / investment_amount) ** (1/years) - 1) * 100
            }
        
        portfolio_final_value = portfolio_values[-1]
        portfolio_total_return = ((portfolio_final_value - investment_amount) / investment_amount) * 100
        
        print(f"✅ UNIFIED AI Portfolio: ${portfolio_final_value:,.0f} ({portfolio_total_return:.1f}%)")
        for ticker, data in benchmark_projections.items():
            print(f"✅ UNIFIED AI {ticker}: ${data['final_value']:,.0f} ({data['total_return_pct']:.1f}%)")
        
        return {
            'timeframe': years,
            'investment_amount': investment_amount,
            'time_labels': time_points,
            'portfolio_projection': {
                'name': 'Your Magnificent 7 Portfolio (AI-Optimized)',
                'color': '#ff6b6b',
                'gradient': 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                'values': portfolio_chart_values,
                'final_value': portfolio_final_value,
                'total_return_pct': portfolio_total_return,
                'ai_predicted_return': ((portfolio_final_value / investment_amount) ** (1/years) - 1) * 100,
                'ai_analysis': portfolio_unified_analysis['analysis_text']
            },
            'benchmark_projections': benchmark_projections,
            'comparison_summary': {
                'outperforming_count': sum(1 for b in benchmark_projections.values() if portfolio_total_return > b['total_return_pct']),
                'total_benchmarks': len(benchmark_projections),
                'portfolio_rank': 'Top performer' if portfolio_total_return > max(b['total_return_pct'] for b in benchmark_projections.values()) else 'Competitive',
                'best_benchmark': max(benchmark_projections.keys(), key=lambda k: benchmark_projections[k]['total_return_pct']),
                'worst_benchmark': min(benchmark_projections.keys(), key=lambda k: benchmark_projections[k]['total_return_pct'])
            },
            'methodology': 'UNIFIED AI-Enhanced: IDENTICAL Claude + FRED + News methodology for portfolio AND all 7 benchmarks',
            'data_consistency': 'UNIFIED: Same market intelligence ensures perfectly consistent comparison across all assets',
            'enhanced_features': {
                'dynamic_timeframe': f'Optimized visualization for {years}-year horizon',
                'comprehensive_coverage': '7 different asset classes analyzed with UNIFIED methodology',
                'risk_diversity': 'Low to Very High risk benchmarks included',
                'unified_analysis': 'Portfolio and benchmarks use IDENTICAL AI analysis'
            }
        }
        
    except Exception as e:
        print(f"❌ Error in UNIFIED AI 7-benchmark comparison: {e}")
        return {'error': str(e)}

def extract_unified_dollar_prediction(analysis_text, investment_amount):
    """
    UNIFIED: Extract the SAME prediction for both main analysis and benchmark comparison
    """
    try:
        print(f"🎯 UNIFIED extraction from analysis...")
        
        # Strategy 1: Look for "Base Case" specifically
        base_case_pattern = r'Base Case \(\$[\d,]+\)'
        base_case_match = re.search(base_case_pattern, analysis_text)
        
        if base_case_match:
            dollar_match = re.search(r'\$[\d,]+', base_case_match.group())
            if dollar_match:
                value = float(dollar_match.group().replace('$', '').replace(',', ''))
                print(f"✅ UNIFIED: Found Base Case ${value:,.0f}")
                return value
        
        # Strategy 2: Look for main prediction percentage
        main_prediction_pattern = r'(\d+)% probability of reaching \$[\d,]+'
        prediction_match = re.search(main_prediction_pattern, analysis_text)
        
        if prediction_match:
            # Find the dollar amount after this percentage
            dollar_pattern = r'reaching \$[\d,]+'
            dollar_match = re.search(dollar_pattern, analysis_text)
            if dollar_match:
                dollar_amount = re.search(r'\$[\d,]+', dollar_match.group())
                if dollar_amount:
                    value = float(dollar_amount.group().replace('$', '').replace(',', ''))
                    print(f"✅ UNIFIED: Found main prediction ${value:,.0f}")
                    return value
        
        # Strategy 3: Look for any reasonable dollar amount
        dollar_amounts = re.findall(r'\$[\d,]+', analysis_text)
        reasonable_values = []
        
        for amount_str in dollar_amounts:
            try:
                value = float(amount_str.replace('$', '').replace(',', ''))
                # Must be reasonable growth (between 1.1x and 3x original investment)
                if investment_amount * 1.1 <= value <= investment_amount * 3:
                    reasonable_values.append(value)
            except:
                continue
        
        if reasonable_values:
            # Take the middle value (likely the base case)
            reasonable_values.sort()
            middle_value = reasonable_values[len(reasonable_values)//2]
            print(f"✅ UNIFIED: Using middle reasonable value ${middle_value:,.0f}")
            return middle_value
        
        # Fallback
        fallback_value = investment_amount * 1.25
        print(f"⚠️ UNIFIED: Using fallback ${fallback_value:,.0f}")
        return fallback_value
        
    except Exception as e:
        print(f"❌ UNIFIED extraction error: {e}")
        return investment_amount * 1.25
        
        # Fallback: Look for percentage and calculate
        percentage_matches = re.findall(r'(\d+(?:\.\d+)?)%', analysis_text)
        for match in percentage_matches:
            pct = float(match)
            if 5 <= pct <= 25:
                estimated_value = investment_amount * (1 + pct/100)
                print(f"✅ Fallback: Using percentage {pct}% to estimate ${estimated_value:,.0f}")
                return estimated_value
        
        fallback_value = investment_amount * 1.33
        print(f"⚠️ Using fallback prediction: ${fallback_value:,.0f}")
        return fallback_value
        
    except Exception as e:
        print(f"❌ Error extracting prediction: {e}")
        return investment_amount * 1.25

def get_unified_portfolio_analysis(portfolio_weights, investment_amount, risk_profile, selected_years):
    """FIXED: Single source of truth for portfolio analysis"""
    try:
        print(f"🎯 UNIFIED Portfolio Analysis: ${investment_amount:,} over {selected_years} years")
        
        analysis_result = enhanced_market_synthesis_with_comprehensive_news(
            portfolio_weights, investment_amount, risk_profile, selected_years
        )
        
        predicted_dollar_value = extract_unified_dollar_prediction(
            analysis_result.get('specific_predictions', ''), investment_amount
        )
        
        return {
            'analysis_text': analysis_result.get('specific_predictions', ''),
            'predicted_dollar_value': predicted_dollar_value,
            'investment_amount': investment_amount,
            'timeframe': f"{selected_years} year{'s' if selected_years != 1 else ''}",
            'portfolio_weights': portfolio_weights,
            'risk_profile': risk_profile,
            'market_context': analysis_result.get('market_context', {}),
            'methodology': 'Unified AI Analysis - Claude + FRED + Comprehensive News',
            'confidence_level': 'High - Consistent across all features'
        }
        
    except Exception as e:
        print(f"❌ Unified analysis error: {e}")
        fallback_value = investment_amount * (1.33 if selected_years == 3 else 1.25 if selected_years == 1 else 1.45)
        return {
            'analysis_text': f'Unified analysis temporarily unavailable: {e}. Conservative estimate for your ${investment_amount:,} portfolio.',
            'predicted_dollar_value': fallback_value,
            'investment_amount': investment_amount,
            'timeframe': f"{selected_years} year{'s' if selected_years != 1 else ''}",
            'portfolio_weights': portfolio_weights,
            'risk_profile': risk_profile,
            'methodology': 'Fallback estimate',
            'confidence_level': 'Low - Fallback'
        }


def portfolio_manager_agent(stocks, risk_profile, investment_amount):
    """Real AI agent that analyzes portfolio and provides intelligent recommendations"""
    
    # DEBUG LINES
    print(f"🔍 DEBUG: Function called with stocks={stocks}, risk={risk_profile}")
    print(f"🔑 DEBUG: API Key exists: {bool(os.getenv('ANTHROPIC_API_KEY'))}")
    print(f"🔑 DEBUG: API Key starts with: {os.getenv('ANTHROPIC_API_KEY')[:15]}...")
    
    prompt = f"""You are an expert portfolio manager. Analyze these stocks for a {risk_profile} investor: {stocks}

Investment Amount: ${investment_amount:,}

Based on current market conditions, provide optimal allocation percentages that sum to 100%.

RESPOND IN THIS EXACT JSON FORMAT:
{{
    "allocations": {{
        "{stocks[0]}": 35,
        "{stocks[1] if len(stocks) > 1 else stocks[0]}": 40,
        "{stocks[2] if len(stocks) > 2 else stocks[0]}": 25
    }},
    "reasoning": "Brief explanation of why these allocations make sense for a {risk_profile} investor",
    "confidence": "High"
}}

Make sure your allocations sum to exactly 100% and provide realistic percentages based on current market analysis."""
    
    try:
        print(f"🧠 Claude analyzing portfolio for {risk_profile} investor...")
        
        response = client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=600,
            messages=[{"role": "user", "content": prompt}]
        )
        
        claude_text = response.content[0].text
        print(f"✅ Claude full response: {claude_text}")
        
        # Try to parse JSON from Claude's response
        import re
        
        # Look for JSON in Claude's response
        json_match = re.search(r'\{.*\}', claude_text, re.DOTALL)
        
        if json_match:
            try:
                claude_json = json.loads(json_match.group())
                claude_allocations = claude_json.get('allocations', {})
                claude_reasoning = claude_json.get('reasoning', claude_text)
                
                # Convert percentages to decimals and normalize
                weights = {}
                total = sum(claude_allocations.values())
                for stock in stocks:
                    if stock in claude_allocations:
                        weights[stock] = round(claude_allocations[stock] / total, 3)
                    else:
                        weights[stock] = round(1/len(stocks), 3)
                
                print(f"🎯 Claude's allocations: {claude_allocations}")
                
                return {
                    "weights": weights,
                    "reasoning": claude_reasoning,
                    "confidence": "High - Claude AI Analysis",
                    "market_context": f"AI-optimized allocation for {risk_profile} investor"
                }
                
            except json.JSONDecodeError:
                print("⚠️ Could not parse JSON, using equal weights with Claude reasoning")
        
        # Fallback to equal weights with Claude's reasoning
        equal_weights = {stock: round(1/len(stocks), 3) for stock in stocks}
        
        return {
            "weights": equal_weights,
            "reasoning": claude_text,
            "confidence": "Medium - Equal Weight with AI Analysis",
            "market_context": f"Equal weight allocation with Claude analysis"
        }
        
    except Exception as e:
        print(f"❌ Claude API Error: {e}")
        equal_weights = {stock: round(1/len(stocks), 3) for stock in stocks}
        return {
            "weights": equal_weights,
            "reasoning": f"API Error: {e}. Using equal weight as fallback.",
            "confidence": "Low - Fallback",
            "market_context": "Fallback allocation due to API issue"
        }

def market_intelligence_agent():
    """AI Agent that analyzes current market conditions"""
    return {
        "market_sentiment": "Claude will analyze current sentiment",
        "key_events": "Claude will identify important recent events",
        "outlook": "Claude will provide market outlook"
    }

def risk_assessment_agent(portfolio_weights):
    """AI Agent that evaluates portfolio risk"""
    return {
        "risk_level": "Claude will assess risk",
        "warnings": "Claude will identify potential issues",
        "suggestions": "Claude will recommend improvements"
    }

def user_advisory_agent(user_profile, portfolio_analysis):
    """AI Agent that provides personalized advice"""
    return {
        "advice": "Claude will provide personalized advice",
        "education": "Claude will explain concepts",
        "next_steps": "Claude will suggest actions"
    }

def clean_ai_response_formatting(raw_response):
    """
    Clean AI response to prevent JSON display issues
    """
    try:
        print(f"🔧 DEBUG: Raw response type: {type(raw_response)}")
        print(f"🔧 DEBUG: Raw response starts with: {raw_response[:50]}...")
        
        # Remove any markdown headers that might appear
        cleaned = raw_response.replace('**AI Portfolio Manager Reasoning:**', '').strip()
        
        # Check if it's pure JSON (starts and ends with braces)
        if cleaned.startswith('{') and cleaned.endswith('}'):
            print("🔧 DEBUG: Detected pure JSON format, extracting reasoning...")
            import json
            try:
                json_data = json.loads(cleaned)
                
                # Try to extract the reasoning field
                if 'ai_reasoning' in json_data:
                    result = json_data['ai_reasoning']
                    print(f"✅ SUCCESS: Extracted ai_reasoning field")
                    return result
                else:
                    print("⚠️ No ai_reasoning field found, creating readable format...")
                    # Create a readable version
                    readable = f"AI Portfolio Recommendation: {json_data.get('recommendation_type', 'Portfolio Analysis')}\n\n"
                    
                    if 'allocations' in json_data:
                        readable += "Recommended Allocations:\n"
                        for stock, weight in json_data['allocations'].items():
                            readable += f"• {stock}: {weight}%\n"
                        readable += "\n"
                    
                    if 'ai_reasoning' in json_data and json_data['ai_reasoning']:
                        readable += f"Analysis:\n{json_data['ai_reasoning']}\n\n"
                    
                    if 'market_outlook' in json_data:
                        readable += f"Market Outlook: {json_data['market_outlook']}\n"
                    
                    if 'confidence_level' in json_data:
                        readable += f"Confidence: {json_data['confidence_level']}"
                    
                    print(f"✅ SUCCESS: Created readable format")
                    return readable
                    
            except json.JSONDecodeError as e:
                print(f"❌ JSON parsing failed: {e}")
                return cleaned
        
        # If it's not JSON, return as-is
        print("🔧 DEBUG: Not JSON format, returning cleaned text")
        return cleaned
        
    except Exception as e:
        print(f"❌ Error in cleaning function: {e}")
        return raw_response

# 🔥 TRUE AI Portfolio Optimizer for Strategy 3
def true_ai_portfolio_optimizer(selected_stocks, risk_profile, investment_amount):
    """
    Strategy 3: TRUE AI Portfolio Manager
    
    This is what Strategy 3 should do:
    1. Evaluate if selected stocks are optimal choices
    2. Recommend specific allocations OR suggest different stocks
    3. Provide alternatives if market conditions are poor
    4. Act like a real portfolio manager making actual decisions
    """
    try:
        print(f"🧠 TRUE AI Portfolio Manager analyzing {selected_stocks} for {risk_profile} investor...")
        
     
 
# Get current stock data for analysis using Alpha Vantage
        stock_data = []
        alpha_vantage_key = os.getenv('ALPHA_VANTAGE_API_KEY')
        ts = TimeSeries(key=alpha_vantage_key, output_format='pandas')
        fd = FundamentalData(key=alpha_vantage_key, output_format='pandas')
        
        for stock in selected_stocks:
            try:
                print(f"📊 Fetching data for {stock} from Alpha Vantage...")
                
                # Get current price and daily data
                data, meta_data = ts.get_daily(symbol=stock, outputsize='compact')
                current_price = data.iloc[0]['4. close'] if not data.empty else 0
                
                # Calculate 1-month change (compare latest vs 20 days ago)
                if len(data) >= 20:
                    month_ago_price = data.iloc[19]['4. close']
                    month_change = ((current_price - month_ago_price) / month_ago_price * 100)
                else:
                    month_change = 0
                
                # Get company overview for fundamental data
                try:
                    overview, _ = fd.get_company_overview(symbol=stock)
                    market_cap = float(overview.iloc[0]['MarketCapitalization']) if not overview.empty else 0
                    pe_ratio = float(overview.iloc[0]['PERatio']) if not overview.empty and overview.iloc[0]['PERatio'] != 'None' else 'N/A'
                except:
                    market_cap = 0
                    pe_ratio = 'N/A'
                
                stock_data.append({
                    'symbol': stock,
                    'current_price': float(current_price),
                    'market_cap': int(market_cap),
                    'pe_ratio': pe_ratio,
                    'month_change': round(month_change, 2),
                    'sector': 'Technology',
                    'recommendation': 'hold'
                })
                
                print(f"✅ Successfully fetched {stock}: ${current_price:.2f}, Market Cap: ${market_cap:,}")
                
            except Exception as e:
                print(f"❌ Error fetching {stock} from Alpha Vantage: {e}")
                stock_data.append({
                    'symbol': stock,
                    'current_price': 0,
                    'market_cap': 0,
                    'pe_ratio': 'N/A',
                    'month_change': 0,
                    'sector': 'Technology',
                    'recommendation': 'hold'
                })
        
        # Build comprehensive prompt for TRUE portfolio management
        stock_analysis = '\n'.join([
            f"- {s['symbol']}: ${s['current_price']:.2f}, Market Cap: ${s['market_cap']:,}, "
            f"PE Ratio: {s['pe_ratio']}, 1-Month Change: {s['month_change']:.1f}%, "
            f"Analyst Rec: {s['recommendation']}"
            for s in stock_data
        ])
        
        ai_portfolio_prompt = f"""You are a senior portfolio manager at Goldman Sachs. A {risk_profile} investor with ${investment_amount:,} wants to invest in these stocks:

{stock_analysis}

CRITICAL REQUIREMENTS - You must provide SPECIFIC ALLOCATIONS:

1. EVALUATE EACH STOCK: Should they invest in ALL these stocks or only some?
2. RECOMMEND SPECIFIC PERCENTAGES: Give exact allocation percentages (must sum to 100%)
3. JUSTIFY YOUR CHOICES: Explain why you're choosing these allocations
4. SUGGEST ALTERNATIVES: If any stocks look poor, recommend alternatives (other M7 stocks, ETFs, bonds)

RISK PROFILE CONSTRAINTS:
- Conservative: Max 20% per stock, include defensive allocations
- Moderate: Max 30% per stock, balanced growth approach  
- Aggressive: Max 50% per stock, growth-focused

RESPOND IN THIS EXACT JSON FORMAT:
{{
    "recommendation_type": "OPTIMIZED_PORTFOLIO" or "ALTERNATIVE_STRATEGY",
    "allocations": {{
        "AAPL": 25.0,
        "MSFT": 30.0,
        "GOOGL": 20.0,
        "QQQ": 15.0,
        "CASH": 10.0
    }},
    "excluded_stocks": ["TSLA", "META"],
    "exclusion_reasons": {{
        "TSLA": "High volatility unsuitable for conservative profile",
        "META": "Regulatory headwinds affecting growth prospects"
    }},
    "ai_reasoning": "Detailed explanation of allocation strategy and market analysis",
    "alternatives_suggested": ["QQQ ETF for diversification", "Treasury bonds for stability"],
    "confidence_level": "High",
    "market_outlook": "Cautious optimism with focus on established tech leaders"
}}

EXAMPLES OF WHAT TO DO:
- "Don't invest in all 7 - focus on AAPL (30%), MSFT (25%), GOOGL (20%), add QQQ ETF (25%)"
- "TSLA too volatile for conservative - replace with bonds"
- "Current market favors mega-cap - overweight AAPL and MSFT"

Be specific, confident, and provide actionable percentages that sum to 100%."""

        print("🎯 Claude analyzing optimal portfolio allocation...")
        
        response = client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=1500,
	    temperature=0.2,  # ADD THIS LINE
            messages=[{"role": "user", "content": ai_portfolio_prompt}]
        )
        
       	claude_response = response.content[0].text
        claude_response = clean_ai_response_formatting(claude_response)
        print(f"🔧 AFTER CLEANING: {claude_response[:100]}...")
        
        print(f"✅ Claude AI Portfolio Manager response received")
        # Try to parse JSON from Claude's response
        import re
        json_match = re.search(r'\{.*\}', claude_response, re.DOTALL)
        
        if json_match:
            try:
                ai_decision = json.loads(json_match.group())
                
                # Ensure allocations sum to 100%
                allocations = ai_decision.get('allocations', {})
                total = sum(allocations.values())
                if total > 0:
                    # Normalize to 100%
                    normalized_allocations = {k: round(v/total, 3) for k, v in allocations.items()}
                else:
                    # Fallback to equal weight of selected stocks
                    normalized_allocations = {stock: round(1/len(selected_stocks), 3) for stock in selected_stocks}
                
                return {
                    'strategy_type': 'TRUE_AI_OPTIMIZATION',
                    'ai_decision': ai_decision.get('recommendation_type', 'OPTIMIZED_PORTFOLIO'),
                    'recommended_allocations': normalized_allocations,
                    'excluded_stocks': ai_decision.get('excluded_stocks', []),
                    'exclusion_reasons': ai_decision.get('exclusion_reasons', {}),
                    'ai_reasoning': ai_decision.get('ai_reasoning', claude_response),
                    'alternatives_suggested': ai_decision.get('alternatives_suggested', []),
                    'confidence_level': ai_decision.get('confidence_level', 'Medium'),
                    'market_outlook': ai_decision.get('market_outlook', 'Analyzing current conditions'),
                    'original_stocks': selected_stocks,
                    'investment_amount': investment_amount,
                    'risk_profile': risk_profile
                }
                
            except json.JSONDecodeError:
                print("⚠️ Could not parse JSON, using text analysis")
        
        # Fallback: Extract key insights from text response
        return {
            'strategy_type': 'TRUE_AI_OPTIMIZATION',
            'ai_decision': 'TEXT_ANALYSIS',
            'recommended_allocations': {stock: round(1/len(selected_stocks), 3) for stock in selected_stocks},
            'excluded_stocks': [],
            'exclusion_reasons': {},
            'ai_reasoning': claude_response,
            'alternatives_suggested': [],
            'confidence_level': 'Medium',
            'market_outlook': 'AI analysis provided in text format',
            'original_stocks': selected_stocks,
            'investment_amount': investment_amount,
            'risk_profile': risk_profile
        }
        
    except Exception as e:
        print(f"❌ AI Portfolio Optimization error: {e}")
        
        # Fallback response
        equal_weights = {stock: round(1/len(selected_stocks), 3) for stock in selected_stocks}
        return {
            'strategy_type': 'FALLBACK',
            'ai_decision': 'ERROR_FALLBACK',
            'recommended_allocations': equal_weights,
            'excluded_stocks': [],
            'exclusion_reasons': {},
            'ai_reasoning': f'AI optimization temporarily unavailable: {e}. Using equal weight allocation.',
            'alternatives_suggested': ['Consider diversifying with QQQ ETF'],
            'confidence_level': 'Low',
            'market_outlook': 'Unable to analyze current market conditions',
            'original_stocks': selected_stocks,
            'investment_amount': investment_amount,
            'risk_profile': risk_profile
        }

# 🔥 ENHANCED: Better Alternative Analysis for Strategy 2
def enhanced_alternative_investment_agent(weights, risk_profile, investment_amount):
    """
    ENHANCED: Better alternative analysis with specific dollar amounts and actionable recommendations
    """
    try:
        max_weight = max(weights.values()) if weights else 0
        num_stocks = len(weights)
        
        print(f"🔍 Enhanced alternatives analysis: max_weight = {max_weight}, num_stocks = {num_stocks}")
        
        # Step 1: Detect if there's a concentration problem
        needs_alternatives = (
            max_weight > 0.25 or  # Any single stock > 25%
            num_stocks < 4 or     # Less than 4 stocks
            sum(1 for w in weights.values() if w > 0.2) > 3  # More than 3 stocks above 20%
        )
        
        if not needs_alternatives:
            return {
                "alternatives_needed": False,
                "reasoning": "Portfolio allocation within acceptable risk parameters - no alternatives needed",
                "suggestions": []
            }
        
        # Build detailed prompt for specific recommendations
        allocation_text = ', '.join([f'{stock}: {weight*100:.1f}%' for stock, weight in weights.items()])
        max_stock = max(weights.keys(), key=lambda k: weights[k])
        max_percentage = max_weight * 100
        
        alternatives_prompt = f"""You are a risk management specialist analyzing this concentrated portfolio:

PORTFOLIO ANALYSIS:
Investment Amount: ${investment_amount:,}
Risk Profile: {risk_profile}
Current Allocation: {allocation_text}
PROBLEM: {max_stock} represents {max_percentage:.1f}% (too concentrated!)

PROVIDE SPECIFIC ACTIONABLE RECOMMENDATIONS:

1. REBALANCING WITHIN MAGNIFICENT 7:
   - Which M7 stocks to add from: AAPL, MSFT, GOOGL, AMZN, META, NVDA, TSLA
   - Specific target percentages for better diversification
   - Dollar amounts to buy/sell for rebalancing

2. EXTERNAL ALTERNATIVES FOR DIVERSIFICATION:
   - Specific ETFs with ticker symbols (QQQ, VGT, XLK, SPY)
   - Bond recommendations for stability (if conservative)
   - International tech exposure options
   - Exact percentage allocations

3. RISK-ADJUSTED RECOMMENDATIONS:
   - Conservative: Include bonds, limit single stock to 15%
   - Moderate: Tech ETFs for diversification, max 25% per stock
   - Aggressive: Growth ETFs acceptable, max 35% per stock

PROVIDE SPECIFIC DOLLAR AMOUNTS:
"Sell $X of {max_stock}, buy $Y of QQQ ETF, $Z of additional M7 stocks"

Make recommendations specific to the {risk_profile} risk profile with exact percentages and dollar amounts."""

        try:
            print("🧠 Claude generating enhanced alternatives...")
            
            response = client.messages.create(
                model="claude-3-haiku-20240307",
                max_tokens=1200,
                messages=[{"role": "user", "content": alternatives_prompt}]
            )
            
            claude_analysis = response.content[0].text
            print("✅ Enhanced alternatives analysis complete")
            
            return {
                "alternatives_needed": True,
                "concentration_risk": "High" if max_weight > 0.4 else "Medium",
                "max_concentration": f"{max_percentage:.1f}%",
                "problem_stock": max_stock,
                "risk_issues": f"High concentration risk: {max_stock} at {max_percentage:.1f}% exceeds safe limits",
                "detailed_recommendations": claude_analysis,
                "investment_amount": investment_amount,
                "risk_profile": risk_profile,
                "action_required": True,
                "recommendation_type": "DIVERSIFICATION_REQUIRED"
            }
            
        except Exception as claude_error:
            print(f"❌ Claude error in alternatives: {claude_error}")
            return {
                "alternatives_needed": True,
                "concentration_risk": "High",
                "max_concentration": f"{max_percentage:.1f}%",
                "detailed_recommendations": f"AI analysis temporarily unavailable. Consider reducing {max_stock} position to below 25% and adding QQQ ETF for diversification.",
                "recommendation_type": "BASIC_DIVERSIFICATION"
            }
        
    except Exception as e:
        print(f"❌ Error in enhanced alternatives function: {e}")
        return {
            "alternatives_needed": True,
            "detailed_recommendations": f"Analysis error: {e}. Consider diversifying your portfolio with additional tech stocks or ETFs.",
            "recommendation_type": "ERROR_FALLBACK"
        }

def get_market_news_and_sentiment(stocks_list):
    """
    Fetch real-time market news and sentiment for your portfolio stocks
    This gives Claude current events to analyze for intelligent predictions
    """
    try:
        # Get Finnhub API key from environment variables
        FINNHUB_API_KEY = os.getenv('FINNHUB_API_KEY', 'your_finnhub_api_key_here')
        
        print(f"📰 Fetching market news for stocks: {stocks_list}")
        
        # Finnhub base URL
        base_url = "https://finnhub.io/api/v1"
        
        market_intelligence = {
            'general_news': [],
            'stock_specific_news': {},
            'sentiment_analysis': {},
            'analyst_recommendations': {}
        }
        
        # Get general market news
        try:
            general_news_url = f"{base_url}/news"
            params = {
                'category': 'technology',
                'token': FINNHUB_API_KEY,
                'count': 10
            }
            
            print("📡 Fetching general tech market news...")
            response = requests.get(general_news_url, params=params, timeout=10)
            
            if response.status_code == 200:
                news_data = response.json()
                
                for article in news_data[:5]:
                    if article.get('headline') and article.get('summary'):
                        market_intelligence['general_news'].append({
                            'headline': article['headline'],
                            'summary': article['summary'][:200] + '...',
                            'source': article.get('source', 'Unknown'),
                            'datetime': article.get('datetime', 0)
                        })
                
                print(f"✅ Retrieved {len(market_intelligence['general_news'])} general news articles")
            else:
                print(f"⚠️ General news API error: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Error fetching general news: {e}")
        
        # Get stock-specific data
        for stock in stocks_list:
            try:
                print(f"📊 Analyzing {stock}...")
                
                # Get company news
                company_news_url = f"{base_url}/company-news"
                news_params = {
                    'symbol': stock,
                    'from': '2024-12-01',
                    'to': '2024-12-08',
                    'token': FINNHUB_API_KEY
                }
                
                news_response = requests.get(company_news_url, params=news_params, timeout=10)
                
                if news_response.status_code == 200:
                    company_news = news_response.json()
                    
                    market_intelligence['stock_specific_news'][stock] = []
                    for article in company_news[:3]:
                        if article.get('headline'):
                            market_intelligence['stock_specific_news'][stock].append({
                                'headline': article['headline'],
                                'summary': article.get('summary', 'No summary available')[:150] + '...'
                            })
                    
                    print(f"✅ Got {len(market_intelligence['stock_specific_news'][stock])} articles for {stock}")
                else:
                    print(f"⚠️ News API error for {stock}: {news_response.status_code}")
                    market_intelligence['stock_specific_news'][stock] = []
                
                # Get sentiment analysis
                sentiment_url = f"{base_url}/news-sentiment"
                sentiment_params = {
                    'symbol': stock,
                    'token': FINNHUB_API_KEY
                }
                
                sentiment_response = requests.get(sentiment_url, params=sentiment_params, timeout=10)
                
                if sentiment_response.status_code == 200:
                    sentiment_data = sentiment_response.json()
                    
                    sentiment_score = sentiment_data.get('compoundScore', 0)
                    
                    if sentiment_score > 0.1:
                        sentiment_label = 'Positive'
                    elif sentiment_score < -0.1:
                        sentiment_label = 'Negative'  
                    else:
                        sentiment_label = 'Neutral'
                    
                    market_intelligence['sentiment_analysis'][stock] = {
                        'score': round(sentiment_score, 2),
                        'label': sentiment_label,
                        'confidence': 'High' if abs(sentiment_score) > 0.3 else 'Medium'
                    }
                    
                    print(f"✅ Sentiment for {stock}: {sentiment_label} ({sentiment_score})")
                else:
                    print(f"⚠️ Sentiment API error for {stock}: {sentiment_response.status_code}")
                    market_intelligence['sentiment_analysis'][stock] = {
                        'score': 0, 'label': 'Neutral', 'confidence': 'Low'
                    }
                
                # Get analyst recommendations
                recommendations_url = f"{base_url}/stock/recommendation"
                rec_params = {
                    'symbol': stock,
                    'token': FINNHUB_API_KEY
                }
                
                rec_response = requests.get(recommendations_url, params=rec_params, timeout=10)
                
                if rec_response.status_code == 200:
                    rec_data = rec_response.json()
                    
                    if rec_data:
                        latest_rec = rec_data[0]
                        market_intelligence['analyst_recommendations'][stock] = {
                            'buy': latest_rec.get('buy', 0),
                            'hold': latest_rec.get('hold', 0), 
                            'sell': latest_rec.get('sell', 0),
                            'strongBuy': latest_rec.get('strongBuy', 0),
                            'strongSell': latest_rec.get('strongSell', 0)
                        }
                        
                        print(f"✅ Got analyst recommendations for {stock}")
                    else:
                        market_intelligence['analyst_recommendations'][stock] = {}
                else:
                    print(f"⚠️ Recommendations API error for {stock}: {rec_response.status_code}")
                    market_intelligence['analyst_recommendations'][stock] = {}
                    
            except Exception as e:
                print(f"❌ Error processing {stock}: {e}")
                market_intelligence['stock_specific_news'][stock] = []
                market_intelligence['sentiment_analysis'][stock] = {'score': 0, 'label': 'Neutral'}
                market_intelligence['analyst_recommendations'][stock] = {}
        
        print(f"✅ Market intelligence gathering complete for {len(stocks_list)} stocks")
        return market_intelligence
        
    except Exception as e:
        print(f"❌ Market intelligence error: {e}")
        return {
            'general_news': [],
            'stock_specific_news': {},
            'sentiment_analysis': {},
            'analyst_recommendations': {},
            'error': f'Finnhub API unavailable: {e}'
        }

@app.route('/')
def home():
    return {"message": "Magnificent 7 AI Portfolio Advisor API", "status": "running"}

@app.route('/api/stocks/magnificent7', methods=['GET'])
def get_magnificent7_data():
    """Get current data for all Magnificent 7 stocks"""
    try:
        current_prices = {}
        for stock in MAGNIFICENT_7:
            ticker = yf.Ticker(stock)
            info = ticker.info
            current_prices[stock] = {
                'price': info.get('currentPrice', 0),
                'change': info.get('regularMarketChangePercent', 0),
                'name': info.get('longName', stock)
            }
        
        market_analysis = market_intelligence_agent()
        
        return jsonify({
            'status': 'success',
            'data': current_prices,
            'ai_analysis': market_analysis,
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/portfolio/optimize', methods=['POST'])
def optimize_portfolio():
    """Let AI optimize portfolio weights"""
    try:
        data = request.json
        selected_stocks = data.get('stocks', MAGNIFICENT_7)
        risk_profile = data.get('risk_profile', 'moderate')
        investment_amount = data.get('amount', 10000)
        
        print(f"🎯 Optimizing portfolio for: {selected_stocks}, {risk_profile} profile")
        
        ai_decision = portfolio_manager_agent(selected_stocks, risk_profile, investment_amount)
        
        return jsonify({
            'status': 'success',
            'ai_recommendation': ai_decision,
            'message': 'Powered by Claude AI - Real intelligence, no formulas!'
        })
    
    except Exception as e:
        print(f"❌ Error in optimize_portfolio: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/portfolio/ai-optimize', methods=['POST'])
def ai_optimize_portfolio():
    """Strategy 3 - True AI Portfolio Optimization"""
    try:
        data = request.json
        selected_stocks = data.get('stocks', [])
        risk_profile = data.get('risk_profile', 'moderate')
        investment_amount = data.get('amount', 10000)
        
        if not selected_stocks:
            return jsonify({'status': 'error', 'message': 'No stocks selected'}), 400
        
        print(f"🤖 AI Portfolio Optimization for: {selected_stocks}")
        
        ai_result = true_ai_portfolio_optimizer(selected_stocks, risk_profile, investment_amount)
        
        return jsonify({
            'status': 'success',
            'ai_optimization': ai_result,
            'message': 'AI Portfolio Manager analysis complete!'
        })
        
    except Exception as e:
        print(f"❌ AI optimization endpoint error: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/portfolio/analyze', methods=['POST'])
def analyze_portfolio():
    """Strategy 2 - Enhanced analysis with better alternative display"""
    try:
        data = request.json
        weights = data.get('weights', {})
        risk_profile = data.get('risk_profile', 'moderate')
        investment_amount = data.get('amount', 10000)
        
        print(f"🔍 Enhanced portfolio analysis: {weights}")
        
        allocation_text = ', '.join([f'{stock}: {weight*100:.1f}%' for stock, weight in weights.items()])
        
        prompt = f"""You are an expert portfolio advisor analyzing this specific allocation chosen by the user:

PORTFOLIO ALLOCATION ANALYSIS:
{allocation_text}
Investment Amount: ${investment_amount:,}
Risk Profile: {risk_profile}

PROVIDE DETAILED ANALYSIS OF EACH WEIGHT:

1. IMPACT ANALYSIS OF EACH POSITION:
   - For each stock, analyze how their specific weight percentage affects portfolio performance
   - Identify which positions are your biggest growth drivers vs. risk contributors
   - Explain how each allocation choice impacts overall returns

2. CONCENTRATION RISK ASSESSMENT:
   - Highlight any positions that are too large (over 25% for moderate, 35% for aggressive)
   - Explain the specific risks of their largest positions
   - Show how concentration affects volatility

3. OPTIMIZATION SUGGESTIONS:
   - Specific recommendations for rebalancing current weights
   - Dollar amounts to adjust: "Reduce STOCK X by $Y, increase STOCK Z by $W"
   - Alternative allocations that maintain their investment preferences

4. PERFORMANCE EXPECTATIONS:
   - How each specific weight contributes to expected returns
   - Which positions could benefit/hurt from current market conditions
   - Risk-adjusted return analysis based on their exact allocation

CRITICAL: Reference their EXACT percentages and provide specific analysis of why these weights matter.

Example format: "Your 35% AAPL position provides portfolio stability but limits growth. Your 40% NVDA allocation is your primary growth driver but creates concentration risk..."

Focus on actionable insights about their specific weight choices with exact percentages and dollar impacts."""
        
        try:
            print("🧠 Claude analyzing portfolio...")
            
            response = client.messages.create(
                model="claude-3-haiku-20240307",
                max_tokens=800,
                messages=[{"role": "user", "content": prompt}]
            )
            
            claude_analysis = response.content[0].text
            print("✅ Portfolio analysis complete")
            
            max_weight = max(weights.values()) if weights else 0
            concentration_risk = "High" if max_weight > 0.4 else "Medium" if max_weight > 0.25 else "Low"
            diversification_score = min((len(weights) / 7) * 100, 100)
            
            alternatives_analysis = enhanced_alternative_investment_agent(weights, risk_profile, investment_amount)
            
            return jsonify({
                'status': 'success',
                'ai_analysis': {
                    'claude_suggestions': claude_analysis,
                    'concentration_risk': concentration_risk,
                    'max_allocation': f"{max_weight*100:.1f}%",
                    'diversification_score': f"{diversification_score:.0f}%",
                    'risk_assessment': f"Portfolio analyzed for {risk_profile} investor",
                    'optimization_available': max_weight > 0.4 or diversification_score < 60,
                    'alternatives': alternatives_analysis,
                    'investment_amount': investment_amount
                },
                'message': 'Enhanced portfolio analysis complete with detailed alternatives!'
            })
            
        except Exception as claude_error:
            print(f"❌ Claude API Error: {claude_error}")
            
            max_weight = max(weights.values()) if weights else 0
            alternatives_analysis = enhanced_alternative_investment_agent(weights, risk_profile, investment_amount)
            
            return jsonify({
                'status': 'success',
                'ai_analysis': {
                    'claude_suggestions': f"API temporarily unavailable. Consider diversifying if concentration risk is high.",
                    'concentration_risk': "Medium",
                    'max_allocation': f"{max_weight*100:.1f}%",
                    'diversification_score': "50%",
                    'alternatives': alternatives_analysis
                },
                'message': 'Basic analysis complete'
            })
    
    except Exception as e:
        print(f"❌ Error in analyze_portfolio: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/market/news-sentiment', methods=['POST'])
def get_portfolio_market_intelligence():
    """API endpoint that frontend calls to get market intelligence for portfolio"""
    try:
        data = request.json
        stocks = data.get('stocks', [])
        
        if not stocks:
            return jsonify({'status': 'error', 'message': 'No stocks provided'}), 400
        
        print(f"🔍 Getting market intelligence for portfolio: {stocks}")
        
        market_data = get_market_news_and_sentiment(stocks)
        
        return jsonify({
            'status': 'success',
            'market_intelligence': market_data,
            'stocks_analyzed': stocks,
            'data_sources': ['Finnhub Market News', 'Finnhub Sentiment Analysis', 'Analyst Recommendations'],
            'timestamp': datetime.now().isoformat(),
            'message': f'Market intelligence retrieved for {len(stocks)} stocks!'
        })
        
    except Exception as e:
        print(f"❌ Market intelligence endpoint error: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/market/economic-intelligence', methods=['GET'])
def get_economic_intelligence():
    """Real-time economic intelligence for portfolio analysis"""
    try:
        print("🏛️ Fetching real-time economic intelligence...")
        
        economic_data = get_fed_economic_data()
        
        summary = {
            'fed_policy_stance': 'Restrictive' if economic_data.get('fed_funds_rate', {}).get('value', 0) > 4.5 else 'Accommodative',
            'inflation_trend': economic_data.get('inflation_rate', {}).get('trend', 'Unknown'),
            'employment_health': 'Strong' if economic_data.get('unemployment', {}).get('value', 10) < 4.5 else 'Weak',
            'economic_cycle': 'Expansion' if economic_data.get('gdp_growth', {}).get('trend', '') == 'Rising' else 'Uncertain'
        }
        
        return jsonify({
            'status': 'success',
            'economic_intelligence': {
                'raw_data': economic_data,
                'summary': summary,
                'data_freshness': 'Real-time from Federal Reserve',
                'indicators_tracked': len(economic_data),
                'last_updated': datetime.now().isoformat()
            },
            'message': 'Real-time economic intelligence successfully retrieved from FRED!'
        })
        
    except Exception as e:
        print(f"❌ Economic intelligence error: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/portfolio/predictions-with-news', methods=['POST'])
def predictions_with_news_and_economics():
    """Portfolio predictions enhanced with real-time economic intelligence AND current events"""
    try:
        data = request.json
        weights = data.get('weights', {})
        risk_profile = data.get('risk_profile', 'moderate')
        investment_amount = data.get('amount', 10000)
        selected_years = data.get('selected_years', 3)
        
        print(f"🔮 Generating event-driven {selected_years}-year predictions for ${investment_amount:,}")
        
        if not weights:
            return jsonify({'status': 'error', 'message': 'No portfolio weights provided'}), 400
        
        enhanced_predictions = enhanced_market_synthesis_with_comprehensive_news(weights, investment_amount, risk_profile, selected_years)
        
        return jsonify({
            'status': 'success',
            'enhanced_predictions': enhanced_predictions,
            'portfolio_summary': {
                'stocks': list(weights.keys()),
                'allocation': weights,
                'investment_amount': investment_amount,
                'risk_profile': risk_profile,
                'timeframe': f"{selected_years} year{'s' if selected_years != 1 else ''}"
            },
            'innovation_level': 'Advanced AI + Real-time News Integration',
            'message': f'Event-driven {selected_years}-year market intelligence analysis complete!'
        })
        
    except Exception as e:
        print(f"❌ News-enhanced predictions error: {e}")
        return jsonify({
            'status': 'error', 
            'message': f'News-enhanced analysis engine error: {e}'
        }), 500

# FIXED: Enhanced 7-benchmark comparison endpoint using UNIFIED AI methodology
@app.route('/api/portfolio/benchmark-comparison', methods=['POST'])
def ai_enhanced_portfolio_benchmark_comparison():
    """
    FIXED: Portfolio vs 7-benchmark comparison using UNIFIED AI methodology for everything
    """
    try:
        data = request.json
        weights = data.get('weights', {})
        investment_amount = data.get('amount', 10000)
        years = data.get('years', 3)
        risk_profile = data.get('risk_profile', 'moderate')
        
        if not weights:
            return jsonify({'status': 'error', 'message': 'Portfolio weights required'}), 400
        
        print(f"📊 UNIFIED AI-Enhanced 7-Benchmark comparison: ${investment_amount:,} over {years} years")
        
        # Use the UNIFIED AI function that analyzes all 7 benchmarks with IDENTICAL methodology
        comparison_data = ai_enhanced_benchmark_comparison(
            weights, investment_amount, years, risk_profile
        )
        
        return jsonify({
            'status': 'success',
            'comparison_data': comparison_data,
            'enhancement': 'Uses UNIFIED IDENTICAL AI methodology (Claude + FRED + News) for portfolio AND all 7 benchmarks',
            'message': f'UNIFIED AI-Enhanced 7-benchmark comparison generated for {years}-year horizon'
        })
        
    except Exception as e:
        print(f"❌ UNIFIED AI 7-benchmark comparison error: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/agents/status', methods=['GET'])
def agent_status():
    """Check status of all AI agents"""
    return jsonify({
        'agents': {
            'portfolio_manager': 'Active with Claude AI',
            'market_intelligence': 'Ready for Claude integration', 
            'risk_assessment': 'Ready for Claude integration',
            'user_advisory': 'Ready for Claude integration',
            'alternatives': 'Active with Claude AI',
            'true_ai_optimizer': 'Active with Claude AI',
            'ai_benchmark_analyzer': 'UNIFIED - Active with IDENTICAL AI Analysis for 7 Benchmarks'
        },
        'benchmarks_supported': list(BENCHMARK_TICKERS.keys()),
        'total_benchmarks': len(BENCHMARK_TICKERS),
        'methodology': 'UNIFIED AI Analysis - Portfolio and benchmarks use IDENTICAL Claude + FRED + News methodology',
        'message': 'All agents powered by Claude AI with UNIFIED 7-benchmark market intelligence!'
    })

# NEW: Benchmark info endpoint for frontend
@app.route('/api/benchmarks/info', methods=['GET'])
def get_benchmark_info():
    """Get information about all supported benchmarks"""
    return jsonify({
        'status': 'success',
        'benchmarks': BENCHMARK_TICKERS,
        'total_count': len(BENCHMARK_TICKERS),
        'categories': list(set(info['category'] for info in BENCHMARK_TICKERS.values())),
        'risk_levels': list(set(info['risk_level'] for info in BENCHMARK_TICKERS.values())),
        'methodology': 'UNIFIED AI Analysis for all benchmarks',
        'message': f'UNIFIED 7-benchmark system with IDENTICAL AI methodology for consistent comparisons'
    })

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    """API health check with UNIFIED benchmark support info"""
    return jsonify({
        'status': 'healthy',
        'api_version': '2.1.0',
        'features': {
            'ai_portfolio_optimization': True,
            'unified_7_benchmark_comparison': True,
            'real_time_news_integration': True,
            'economic_intelligence': True,
            'claude_ai_agents': True,
            'dynamic_timeframe_visualization': True,
            'unified_ai_methodology': True
        },
        'benchmarks_supported': len(BENCHMARK_TICKERS),
        'strategies_available': 3,
        'methodology': 'UNIFIED: Portfolio and benchmarks use IDENTICAL AI analysis',
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    print("🚀 Starting UNIFIED AI Portfolio Advisor API...")
    print("🤖 AI Agents (Claude-powered with UNIFIED methodology):")
    print("   🧠 Portfolio Manager Agent - ACTIVE")
    print("   📊 Market Intelligence Agent - ACTIVE") 
    print("   ⚠️  Risk Assessment Agent - ACTIVE")
    print("   👨‍🏫 User Advisory Agent - ACTIVE")
    print("   🔄 Alternative Investment Agent - ENHANCED")
    print("   🔮 Enhanced Prediction Engine - ACTIVE")
    print("   📰 News Integration Engine - ACTIVE")
    print("   🤖 TRUE AI Portfolio Optimizer - ACTIVE")
    print("   📈 UNIFIED AI 7-Benchmark Comparison - FIXED!")
    print()
    print(f"📊 Supporting {len(BENCHMARK_TICKERS)} benchmarks with UNIFIED methodology:")
    for ticker, info in BENCHMARK_TICKERS.items():
        print(f"   {info['emoji']} {ticker}: {info['name']} ({info['category']}) - {info['risk_level']} Risk")
    print()
    print("🎯 UNIFIED Features:")
    print("   • IDENTICAL AI methodology for portfolio AND all benchmarks")
    print("   • Same Claude + FRED + News analysis for consistent comparisons")
    print("   • Dynamic timeframe visualization (1/3/5 years)")
    print("   • Comprehensive asset class coverage")
    print("   • Risk-adjusted benchmark selection")
    print("   • Real-time economic & news integration")
    print()
    print("📡 No formulas - Pure AI reasoning with UNIFIED methodology!")
    app.run(debug=True, host='127.0.0.1', port=5000)
