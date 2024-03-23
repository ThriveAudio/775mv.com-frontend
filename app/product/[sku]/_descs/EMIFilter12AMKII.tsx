import Bullet from '@/app/_components/bullet'
import Tab from '@/app/_components/tab'
import Row from '@/app/_components/row'
import { Paragraph } from '@/app/_components/paragraph'
import { Table } from '@/app/_components/table'

export function shortDesc() {
  return (
    <div className='text-amber'>
      <Row>
        <b>High Current</b>&nbsp;Power line EMI filter / conditioner.
      </Row>
      <Tab>
        <Bullet>Deep suppression of common-mode and differential noise</Bullet>
        <Bullet>Advanced Ground Loop Breaking</Bullet>
        <Bullet>Zero Noise Surge Protection</Bullet>
        <Bullet>Low impedance PCB, fuses, and terminals</Bullet>
        <Bullet>Top quality parts by WIMA, Triad, Schurter</Bullet>
      </Tab>
      Recommended load currents up to 12A.
      <br/>Maximum current – 16A.
    </div>
  )
}

export function longDesc() {
  return (
    <div className='text-amber'>
      The 12A-MKII is a high current, high efficiency filter that is a perfect fit for an egress filter in an advanced power conditioner.
      It also serves very well as a standalone filter for high power loads, such as <i>Vacuum Tube Amplifiers</i>
      , high power <i>Class A Amplifiers</i>, etc. Due to its extremely low impedance at low frequencies and advanced
      filtering and ground loop braking techniques this filter provides <u>clean power for the most dynamic sound reproduction</u>.
      <Paragraph>The filtering methodology and schematics have been approved by hundreds of audiophiles who have been using filters by
      MyElectrons as from the year 2014. The Elite+ series builds upon the third, improved generation of Power Line Filters for Audio
      by MyElectrons and Thrive Audio. Mark II gets boost in the depth of RF noise suppression by its extra stage of filtration – it is
      a 9th order filter.</Paragraph>
      <Paragraph>For the optimal EMI and Noise Suppression the load current of this variant of the filter should be less than 12A RMS.
      The filter can sustain up to 16A RMS of the load indefinitely.</Paragraph>
      <Paragraph><b>Unrivaled level of EMI / noise suppression for high current power lines</b><br/>
      The filter deploys common-mode transformers of the highest inductance value practically available on the market for the specified
      load current. This ensures high efficiency of the <u>common-mode</u> EMI suppression.<br/>Two RF and two high inductance differential EMI filtering coils, combined with top grade metal film polypropylene capacitors, form a very efficient barrier for the <u>differential</u> EMI / noise.
      <br/>Careful dampening of both common-mode and differential filtering circuits ensures <u>resonance-free</u>, quiet operation of the filter.</Paragraph>
    </div>
  )
}

export function specs() {
  return (
    <Table rows={1} cols={2}>
      <div><b>Voltage</b></div>
      <div><i>120V, 240V</i></div>
    </Table>
  )
}