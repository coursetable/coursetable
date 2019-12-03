{*
	SeasonsDropdown.tpl

	Type: template component
	Usage: generates the "dropdown-submenu" parts of the dropdown menu for each season

	Variables:
		availableSeasons: seasons available for selection
        season: current season (e.g., '201503')
        (optional) href: link to use in the href section, with '<season>' being replaced with the given season
			Defaults to '#'
*}

{if ! isset($href) || !$href}
	{$href = '#'}
{/if}

{$seasonsByYear = []}
{foreach $availableSeasons as $availableSeason}
	{$year = substr($availableSeason, 0, 4)}
	{$yearSeason = substr($availableSeason, 4, 2)}
	{$seasonsByYear[$year][] = $yearSeason}
	{$success = rsort($seasonsByYear[$year])}
{/foreach}
{$success = krsort($seasonsByYear)}
{foreach $seasonsByYear as $year => $seasons}
<li class="dropdown-submenu">
	<a tabindex="-1" href="#" class="year-link" onclick="return preventDefault(event);">{$year}</a>
	<ul class="dropdown-menu">
	{foreach $seasons as $availableSeason}
		<li><a tabindex="-1" href="{$href|replace:'<season>':"`$year``$availableSeason`"}" class="season-link" data-season="{$year}{$availableSeason}">{if $availableSeason % 100 == 1}Spring{elseif $availableSeason % 100 == 2}Summer{else}Fall{/if}</a></li>
	{/foreach}
	</ul>
</li>
{/foreach}

<script>
{literal}
function preventDefault(event) {
	event.preventDefault();
	event.stopPropagation();
	return event;
}
{/literal}
</script>
