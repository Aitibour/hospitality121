export type SustainabilityTopic = {
  slug: string
  title: string
  subtitle: string
  description: string
  keywords: string
  intro: string[]
  sections: { heading: string; body: string }[]
  filterTerms: string[]
}

export const SUSTAINABILITY_TOPICS: SustainabilityTopic[] = [
  {
    slug: 'sustainable-operations',
    title: 'Sustainable Hotel Operations',
    subtitle: 'Building a Greener Hospitality Business',
    description: 'How hotels are embedding sustainability into daily operations, from food waste reduction and energy efficiency to supply chain ethics and guest engagement.',
    keywords: 'sustainable hotel operations, hotel sustainability, eco-friendly hospitality, green hotel management, sustainable tourism',
    filterTerms: ['SUSTAINABILITY', 'SUSTAINABLE', 'GREEN', 'ECO', 'WELLNESS'],
    intro: [
      'Sustainable hotel operations have evolved from a marketing differentiator into a baseline operational requirement. Guests, investors, corporate buyers, and regulatory bodies now expect hotels to demonstrate measurable progress on environmental and social commitments, not just publish a sustainability policy.',
      'The most effective programmes integrate sustainability into procurement, food and beverage, housekeeping, maintenance, and guest communications simultaneously. Piecemeal efforts are being replaced by structured programmes with defined targets, third-party verification, and transparent public reporting.',
    ],
    sections: [
      {
        heading: 'Food Waste and Supply Chain',
        body: 'Food waste accounts for a significant proportion of hospitality\'s environmental impact. Leading hotels are deploying AI-powered forecasting tools that reduce over-purchasing, partnering with local suppliers to shorten supply chains, and tracking kitchen waste at the gram level. Menu engineering that incorporates seasonal and plant-forward options is reducing both food miles and cost per cover while satisfying the growing segment of sustainability-conscious travellers.',
      },
      {
        heading: 'Energy and Water Management',
        body: 'Smart building management systems now enable hotels to monitor energy consumption at the zone level, automatically adjusting HVAC and lighting based on occupancy data from PMS and keycard systems. Hotels achieving the most significant reductions are coupling technology investment with staff training and guest engagement campaigns, turning energy efficiency into a shared goal rather than a back-office metric.',
      },
      {
        heading: 'Housekeeping and Chemical Reduction',
        body: 'Linen and towel reuse programmes are standard, but leading operators are going further by switching to concentrated, biodegradable cleaning products, eliminating single-use plastics from guest rooms entirely, and sourcing amenities from certified sustainable or refillable suppliers. Guests increasingly respond positively to visible sustainability actions in rooms, reporting higher satisfaction when hotels communicate the environmental benefits of their choices.',
      },
      {
        heading: 'Guest Engagement and Certification',
        body: 'Sustainability certification schemes including Green Key, EarthCheck, and LEED provide structured pathways and third-party credibility. Beyond certification, hotels are engaging guests through in-room sustainability guides, carbon offset options at booking, and local community experiences that connect travellers with conservation projects. These programmes generate authentic content and foster loyalty among the fast-growing segment of purpose-driven travellers.',
      },
    ],
  },
  {
    slug: 'smart-operations',
    title: 'Smart Hotel Operations',
    subtitle: 'Technology-Driven Efficiency and Sustainability',
    description: 'How intelligent building systems, IoT sensors, and automation help hotels reduce energy consumption, optimise resources, and improve guest experiences.',
    keywords: 'smart hotel operations, hotel IoT, building management systems, hotel automation, energy management hotels',
    filterTerms: ['SUSTAINABILITY', 'TECHNOLOGY', 'TECH', 'INNOVATION', 'DIGITAL'],
    intro: [
      'Smart operations technology is the bridge between sustainability ambition and measurable outcomes. IoT sensors, building management systems, and intelligent automation platforms enable hotels to reduce energy consumption, minimise waste, and optimise staff deployment without compromising the guest experience.',
      'The shift from manual processes to data-driven operations is accelerating as costs fall and integration with existing PMS and booking platforms becomes seamless. Hotels that have invested in smart operations infrastructure are reporting energy reductions of 20 to 35 percent alongside improvements in guest satisfaction scores driven by faster response times and more consistent room conditions.',
    ],
    sections: [
      {
        heading: 'IoT and Building Management',
        body: 'Internet of Things sensors embedded in guest rooms, public spaces, and back-of-house areas provide real-time data on temperature, humidity, occupancy, and equipment performance. Integrated building management systems use this data to control HVAC, lighting, and electrical systems dynamically, reducing energy waste from unoccupied spaces while maintaining comfort standards in rooms with guests. The most advanced deployments link IoT data with PMS check-in and check-out events to anticipate room readiness requirements before guests arrive.',
      },
      {
        heading: 'Predictive Maintenance',
        body: 'Predictive maintenance platforms analyse operational data from equipment across the property to identify deterioration patterns before failure occurs. This shifts maintenance from reactive to proactive, reducing downtime, extending equipment life, and eliminating the guest experience disruption caused by unexpected breakdowns. Hotels using predictive maintenance report significant reductions in both maintenance costs and the number of guest complaints related to in-room equipment.',
      },
      {
        heading: 'Staff and Resource Optimisation',
        body: 'Intelligent scheduling platforms integrate occupancy forecasts, historical demand patterns, and real-time event data to optimise staffing levels across departments. Housekeeping management tools use room occupancy data and guest departure signals to prioritise room cleaning sequences, reducing the time rooms spend out of service and allowing front desk teams to offer earlier check-in without additional labour cost. These systems reduce both overstaffing costs and the service gaps that occur when properties are understaffed.',
      },
      {
        heading: 'Water Management and Monitoring',
        body: 'Water consumption is one of the most significant and frequently underreported sustainability metrics in hospitality. Smart water management systems monitor consumption in real time across the property, flagging anomalies that indicate leaks or inefficient usage before they become costly. Submetering at the department or floor level enables precise attribution of water usage, turning an unmanaged overhead into a controllable operational variable. Hotels in water-stressed regions are combining smart monitoring with guest communication programmes to achieve material reductions in consumption per occupied room.',
      },
    ],
  },
  {
    slug: 'green-technologies',
    title: 'Green Hotel Technologies',
    subtitle: 'Sustainable Technology Solutions for Hospitality',
    description: 'The technologies enabling hotels to decarbonise operations, from solar and heat pump systems to EV charging infrastructure and green building design.',
    keywords: 'green hotel technology, hotel solar energy, EV charging hotels, sustainable hotel technology, hotel decarbonisation',
    filterTerms: ['SUSTAINABILITY', 'TECHNOLOGY', 'GREEN', 'INNOVATION'],
    intro: [
      'Green technology adoption in hospitality is accelerating as capital costs fall, regulatory requirements tighten, and investor and guest expectations shift. Properties that invested early in renewable energy, heat pump systems, and efficient building envelopes are now delivering the financial and reputational returns that justify further investment across portfolios.',
      'The technology landscape spans renewable energy generation, electrification of heating and cooling, EV infrastructure, water recycling systems, and sustainable building materials. Each investment category carries its own financial profile, regulatory context, and guest-facing narrative that hotel operators need to understand before committing capital.',
    ],
    sections: [
      {
        heading: 'Solar and Renewable Energy',
        body: 'Solar photovoltaic installations are now financially viable for most hotel typologies, with rooftop and carport systems offering payback periods of six to twelve years in most European and North American markets. Hotels with large flat roofs and significant daytime energy consumption from kitchens, laundry, and conference facilities are particularly well suited. Battery storage systems are extending the value of solar generation by shifting consumption from peak pricing periods, and power purchase agreements are enabling hotels without capital budgets to access renewable energy with minimal upfront investment.',
      },
      {
        heading: 'Heat Pumps and Building Electrification',
        body: 'The transition from gas-fired boilers and chillers to heat pump systems is central to hotel decarbonisation strategies. Air source and ground source heat pumps deliver heating, cooling, and domestic hot water with significantly lower carbon intensity than fossil fuel systems, and their efficiency advantage grows as electricity grids decarbonise. The principal challenges are capital cost, space requirements, and hot water delivery temperatures in older buildings, all of which are being addressed by advancing technology and improving financing structures tailored to the hospitality sector.',
      },
      {
        heading: 'EV Charging Infrastructure',
        body: 'Electric vehicle charging has moved from amenity to expectation for a growing proportion of hotel guests, particularly in the corporate and luxury segments. Hotels are deploying destination charging across car parks, with smart charging management systems that balance load across the property, integrate with grid tariff structures, and offer guests branded charging experiences. Early movers are monetising EV infrastructure through premium pricing and loyalty programme integration while meeting the increasingly common requirement from corporate travel managers for EV charging at contracted properties.',
      },
      {
        heading: 'Water Recycling and Waste Systems',
        body: 'Greywater recycling systems that capture, treat, and reuse water from showers and hand basins for toilet flushing and landscape irrigation are delivering water reductions of 30 to 50 percent in hotels where they have been installed. Food waste biodigesters are converting kitchen waste into biogas or compost on-site, eliminating disposal costs and closing the nutrient loop. These technologies are particularly compelling in markets with high water costs or stringent organic waste regulations, and they provide authentic sustainability stories that resonate with guests and media.',
      },
    ],
  },
  {
    slug: 'esg-reporting',
    title: 'ESG and Future Travel',
    subtitle: 'Environmental, Social and Governance Strategy in Hospitality',
    description: 'How hotels are building ESG frameworks, meeting investor reporting requirements, and aligning with global sustainability standards.',
    keywords: 'hotel ESG, hospitality ESG reporting, sustainable travel, hotel carbon reporting, hospitality governance',
    filterTerms: ['SUSTAINABILITY', 'ESG', 'TRENDS', 'GUEST EXPERIENCE'],
    intro: [
      'ESG reporting has shifted from a voluntary disclosure exercise to a core strategic requirement for hospitality businesses accessing institutional capital, corporate contracts, and premium market segments. Investors, lenders, and major corporate travel buyers are requiring standardised, verifiable ESG data as a condition of engagement.',
      'The regulatory landscape is intensifying, with mandatory sustainability disclosure requirements now in force or being phased in across the EU, UK, and increasingly in North American markets. Hotels that have built robust data collection and reporting infrastructure are turning compliance into competitive advantage, using their ESG performance to differentiate in procurement processes and investor communications.',
    ],
    sections: [
      {
        heading: 'ESG Frameworks and Standards',
        body: 'The Global Reporting Initiative, Sustainability Accounting Standards Board, and Task Force on Climate-Related Financial Disclosures provide the most widely referenced frameworks for hospitality ESG disclosure. Individual hotel groups are aligning their reporting to these standards to facilitate comparison by investors and corporate buyers. The proliferation of frameworks is consolidating, with IFRS Sustainability Disclosure Standards now providing a global baseline that many regional requirements are adopting. Hotels working with ESG advisors to map their existing data against these frameworks are finding that much of the underlying data already exists but needs to be structured and verified.',
      },
      {
        heading: 'Carbon Accounting and Scope 3',
        body: 'Carbon accounting in hospitality extends beyond direct energy consumption to include the supply chain emissions that constitute the majority of a hotel\'s total carbon footprint. Scope 3 emissions from food and beverage procurement, guest travel, and capital goods represent the largest and most difficult category to measure and reduce. Hotels are beginning to work with suppliers to collect emissions data, shifting procurement toward lower-carbon options where data is available, and engaging guests in offset and compensation programmes that cover the travel component of their stay.',
      },
      {
        heading: 'Social Impact and Governance',
        body: 'The social and governance dimensions of ESG are receiving increasing scrutiny from investors and buyers alongside the environmental metrics. Fair wages, worker safety, diversity and inclusion at leadership level, supply chain labour standards, and community economic contribution are all becoming reportable metrics. Hotels with strong community employment programmes, supplier diversity initiatives, and transparent pay equity data are finding these credentials increasingly valuable in public procurement processes and high-value corporate contract negotiations.',
      },
      {
        heading: 'Future Travel Trends and Guest Expectations',
        body: 'The relationship between sustainability and travel demand is evolving rapidly. Research consistently shows that sustainable practices are a positive factor in hotel choice for a growing proportion of travellers, particularly in the 25 to 45 age bracket that will dominate leisure and business travel spend over the next decade. Hotels that lead on sustainability communication, connecting specific actions to measurable outcomes, are building the brand equity that will drive preference and loyalty as future travel behaviour shifts further toward purpose-driven decision making.',
      },
    ],
  },
]

export function getSustainabilityTopicBySlug(slug: string): SustainabilityTopic | undefined {
  return SUSTAINABILITY_TOPICS.find(t => t.slug === slug)
}
