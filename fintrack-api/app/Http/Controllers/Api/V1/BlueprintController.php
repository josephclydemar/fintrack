<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Controllers\Controller;

class BlueprintController extends Controller
{
    // keys
    private string $gridPropsBlueprint = 'grid_props_blueprint';
    private string $chartPropsBlueprint = 'chart_props_blueprint';

    private string $params = 'params';
    private string $query = 'query';
    private string $urlEndpoint = 'url_endpoint';

    /**
     * Serve Grid blueprints
     */
    public function getGridBlueprint(string $user, string $id)
    {
        $blueprint = config($this->gridPropsBlueprint . '.' . $id);
        if($blueprint === null) throw new ModelNotFoundException('The requested GridProps id:' . $id . ' was not found.');

        $gridUrlEndpoint = $blueprint[$this->params][$this->query][$this->urlEndpoint];
        $blueprint[$this->params][$this->query][$this->urlEndpoint] = str_replace('{user}', $user, $gridUrlEndpoint);
        return $this->response(data: $blueprint);
    }

    /**
     * Serve Chart blueprints
     */
    public function getChartBlueprint(string $user, string $id)
    {
        $blueprint = config($this->chartPropsBlueprint . '.' . $id);
        if($blueprint === null) throw new ModelNotFoundException('The requested ChartProps id:' . $id . ' was not found.');
        $gridUrlEndpoint = $blueprint[$this->params][$this->query][$this->urlEndpoint];
        $blueprint[$this->params][$this->query][$this->urlEndpoint] = str_replace('{user}', $user, $gridUrlEndpoint);
        return $this->response(data: $blueprint);
    }
}
